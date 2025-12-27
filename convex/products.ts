import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import checkPermission from "../src/lib/checkPermission";
import { v } from "convex/values";
import { throwValidation } from "../src/lib/throwValidation";
import { createProductSchema, productFormSchema } from "../src/schemas/schemas";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";
import { R2 } from "@convex-dev/r2";
import { components } from "./_generated/api";

const r2 = new R2(components.r2);

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.id("categories"),
    costPrice: v.number(),
    salePrice: v.number(),
    productColors: v.array(
      v.object({
        colorHex: v.string(),
        colorName: v.string(),
        images: v.array(v.string()),
        sizes: v.array(
          v.object({
            size: v.string(),
            quantity: v.number(),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "unauthorized",
        message: "L'utilisateur doit être authentifié pour créer des produits",
        details: {
          root: "Veuillez vous connecter en tant qu'administrateur pour créer des produits",
        },
      });
    }
    const hasAccess = await checkPermission(ctx, userId, "admin");
    if (!hasAccess) {
      throw new ConvexError({
        code: "unauthorized",
        message: "L'utilisateur n'a pas la permission de créer des produits",
        details: {
          root: "Vous devez être administrateur pour créer des produits",
        },
      });
    }
    const parsed = createProductSchema.safeParse(args);
    if (!parsed.success) {
      throw throwValidation(parsed.error);
    }
    const existingProduct = await ctx.db
      .query("products")
      .withIndex("by_name", (q) => q.eq("name", parsed.data.name))
      .first();
    if (existingProduct) {
      throw new ConvexError({
        code: "conflict",
        message: "Un produit avec ce nom existe déjà",
        details: {
          name: "Le nom du produit doit être unique",
        },
      });
    }
    const category = await ctx.db.get("categories", args.category);
    if (!category) {
      throw new ConvexError({
        code: "not_found",
        message: "Catégorie non trouvée",
        details: {
          category: "La catégorie spécifiée n'existe pas",
        },
      });
    }
    const productId = await ctx.db.insert("products", {
      name: parsed.data.name.trim(),
      description: parsed.data.description.trim(),
      category: parsed.data.category.trim() as Id<"categories">,
      costPrice: parsed.data.costPrice,
      salePrice: parsed.data.salePrice,
    });
    for (const color of parsed.data.productColors) {
      const productColorId = await ctx.db.insert("productColors", {
        productId: productId.trim() as Id<"products">,
        colorHex: color.colorHex.trim(),
        colorName: color.colorName.trim(),
        images: color.images,
      });
      for (const size of color.sizes) {
        await ctx.db.insert("productVariants", {
          productId: productId.trim() as Id<"products">,
          size: size.size.trim(),
          quantity: size.quantity,
          productColor: productColorId,
        });
      }
    }
  },
});

export const getGenerallProductsInfo = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "unauthorized",
        message: "L'utilisateur doit être authentifié pour voir les produits",
        details: {
          root: "Veuillez vous connecter pour voir les produits",
        },
      });
    }
    const hasAccess = await checkPermission(ctx, userId, "staff");
    if (!hasAccess) {
      throw new ConvexError({
        code: "unauthorized",
        message: "L'utilisateur n'a pas la permission de voir les produits",
        details: {
          root: "Vous devez être administrateur pour voir les produits",
        },
      });
    }
    return {
      totalProducts: (await ctx.db.query("products").collect()).length,
      totalUnits: (await ctx.db.query("productVariants").collect()).reduce(
        (acc, productVariant) => acc + productVariant.quantity,
        0,
      ),
      projectRevenue: (await ctx.db.query("products").collect()).reduce(
        (acc, price) => acc + price.salePrice,
        0,
      ),
    };
  },
});

export const listProducts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "unauthorized",
        message: "User must be authenticated to view products",
        details: {
          root: "Please log in to view products",
        },
      });
    }
    const hasAccess = await checkPermission(ctx, userId, "staff");
    if (!hasAccess) {
      throw new ConvexError({
        code: "unauthorized",
        message: "User does not have permission to view products",
        details: {
          root: "You must be an admin to view products",
        },
      });
    }
    const results = await ctx.db
      .query("products")
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (product) => {
          const [category, productColors] = await Promise.all([
            ctx.db.get("categories", product.category),
            ctx.db
              .query("productColors")
              .withIndex("by_product", (q) => q.eq("productId", product._id))
              .collect(),
          ]);

          return {
            _id: product._id,
            name: product.name,
            description: product.description,
            costPrice: product.costPrice,
            salePrice: product.salePrice,
            category: {
              _id: product.category,
              name: category?.name || "",
            },
            productColors: await Promise.all(
              productColors.map(async (productColor) => {
                const variants = await ctx.db
                  .query("productVariants")
                  .withIndex("by_product_color", (q) =>
                    q
                      .eq("productId", product._id)
                      .eq("productColor", productColor._id),
                  )
                  .collect();

                return {
                  _id: productColor._id,
                  colorName: productColor.colorName,
                  colorHex: productColor.colorHex,
                  images: productColor.images
                    ? await Promise.all(
                        productColor.images.map(async (image) => ({
                          imageUploadStatus: "success" as const,
                          imageKey: image,
                          imageUrl: await r2.getUrl(image, {
                            expiresIn: 604800,
                          }),
                          imageId: image,
                        })),
                      )
                    : [],
                  sizes: variants.map((variant) => ({
                    size: variant.size,
                    quantity: variant.quantity,
                    variantId: variant._id,
                  })),
                };
              }),
            ),
          };
        }),
      ),
    };
  },
});


export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "unauthorized",
        message: "User must be authenticated to delete products",
        details: {
          root: "Please log in to delete products",
        },
      });
    }
    const hasAccess = await checkPermission(ctx, userId, "staff");
    if (!hasAccess) {
      throw new ConvexError({
        code: "unauthorized",
        message: "User does not have permission to delete products",
        details: {
          root: "You must be an admin to delete products",
        },
      });
    }
    const product = await ctx.db.get("products", args.productId);
    if (!product) {
      throw new ConvexError({
        code: "not_found",
        message: "Product not found",
        details: {
          productId: "The specified product does not exist",
        },
      });
    }
    await ctx.db.delete("products", args.productId);
    const productVarinats = await ctx.db.query("productVariants")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    for (const variant of productVarinats) {
      await ctx.db.delete("productVariants", variant._id);
    }
    const productColors = await ctx.db.query("productColors")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    for (const color of productColors) {
      await ctx.db.delete("productColors", color._id);
    }
  },
})


export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.string(),
    description: v.string(),
    category: v.id("categories"),
    costPrice: v.number(),
    salePrice: v.number(),
    productColors: v.array(
      v.object({
        productColorId: v.optional(v.id("productColors")),
        colorHex: v.string(),
        colorName: v.string(),
        images: v.array(v.string()),
        sizes: v.array(
          v.object({
            size: v.string(),
            quantity: v.number(),
            productVariantId: v.optional(v.id("productVariants")),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "unauthorized",
        message: "L'utilisateur doit être authentifié pour modifier des produits",
        details: {
          root: "Veuillez vous connecter en tant qu'administrateur pour modifier des produits",
        },
      });
    }
    const hasAccess = await checkPermission(ctx, userId, "admin");
    if (!hasAccess) {
      throw new ConvexError({
        code: "unauthorized",
        message: "L'utilisateur n'a pas la permission de modifier des produits",
        details: {
          root: "Vous devez être administrateur pour modifier des produits",
        },
      });
    }
    const product = await ctx.db.get("products", args.productId);
    if (!product) {
      throw new ConvexError({
        code: "not_found",
        message: "Produit non trouvé",
        details: {
          productId: "Le produit spécifié n'existe pas",
        },
      });
    }
    const parsed = createProductSchema.safeParse(args);
    if (!parsed.success) {
      throw throwValidation(parsed.error);
    }
    if (product.name !== parsed.data.name) {
      const existingProduct = await ctx.db
        .query("products")
        .withIndex("by_name", (q) => q.eq("name", parsed.data.name))
        .first();
      if (existingProduct) {
        throw new ConvexError({
          code: "conflict",
          message: "Un produit avec ce nom existe déjà",
          details: {
            name: "Le nom du produit doit être unique",
          },
        });
      }
    }
    const category = await ctx.db.get("categories", args.category);
    if (!category) {
      throw new ConvexError({
        code: "not_found",
        message: "Catégorie non trouvée",
        details: {
          category: "La catégorie spécifiée n'existe pas",
        },
      });
    }
    const productColorMap = new Map<string, string[]>();
    await Promise.all(args.productColors.map(async (color) => {
      if (color.productColorId) {
        const productColor = await ctx.db.get("productColors", color.productColorId);
        if (!productColor) {
          throw new ConvexError({
            code: "not_found",
            message: "Couleur de produit non trouvée",
            details: {
              productColorId: "La couleur de produit spécifiée n'existe pas",
            },
          });
        }
        productColorMap.set(color.productColorId, productColor.images);
      }
      await Promise.all(color.sizes.map(async (size) => {
        if (size.productVariantId) {
          const productVariant = await ctx.db.get("productVariants", size.productVariantId);
          if (!productVariant) {
            throw new ConvexError({
              code: "not_found",
              message: "Variante de produit non trouvée",
              details: {
                productVariantId: "La variante de produit spécifiée n'existe pas",
              },
            });
          }
        }
      }));
    })); 

    await ctx.db.patch("products", args.productId, {
      name: parsed.data.name.trim(),
      description: parsed.data.description.trim(),
      category: parsed.data.category.trim() as Id<"categories">,
      costPrice: parsed.data.costPrice,
      salePrice: parsed.data.salePrice,
    });

    await Promise.all(args.productColors.map(async (color) => {
      if (color.productColorId) {
        const oldImages = productColorMap.get(color.productColorId) || [];
        const imagesToDelete = oldImages.filter(img => !color.images.includes(img));
        await Promise.all(imagesToDelete.map(async img => await r2.deleteObject(ctx, img)));
        await ctx.db.patch("productColors", color.productColorId, {
          colorHex: color.colorHex.trim(),
          colorName: color.colorName.trim(),
          images: color.images,
        });
      } else {
        const productColorId = await ctx.db.insert("productColors", {
          productId: args.productId as Id<"products">,
          colorHex: color.colorHex.trim(),
          colorName: color.colorName.trim(),
          images: color.images,
        });
        color.productColorId = productColorId;
      }
      
      await Promise.all(color.sizes.map(async (size) => {
        if (size.productVariantId) {
          await ctx.db.patch("productVariants", size.productVariantId, {
            size: size.size.trim(),
            quantity: size.quantity,
          });
        } else {
          await ctx.db.insert("productVariants", {
            productId: args.productId as Id<"products">,
            size: size.size.trim(),
            quantity: size.quantity,
            productColor: color.productColorId!,
          });
        }
      }));
    }))
  }
})

// export const createImageMetadata = internalMutation({
//   args: {
//     productColorId: v.id("product_colors"),
//     imageKey: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const productColor = await ctx.db.get("product_colors", args.productColorId);
//     if (!productColor) {
//       throw new ConvexError({
//         code: "not_found",
//         message: "Product color not found",
//         details: {
//           productColor: "The specified product color does not exist",
//         },
//       });
//     }
//     await ctx.db.patch("product_colors", args.productColorId, {
//       ...productColor,
//       images: [...(productColor.images || []), args.imageKey],
//     })
//   },
// });
