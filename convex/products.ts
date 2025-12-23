import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import checkPermission from "../src/lib/checkPermission";
import { v } from "convex/values";
import { throwValidation } from "../src/lib/throwValidation";
import { createProductSchema } from "../src/schemas/schemas";
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
      name: parsed.data.name,
      description: parsed.data.description,
      category: parsed.data.category as Id<"categories">,
      costPrice: parsed.data.costPrice,
      salePrice: parsed.data.salePrice,
    });
    for (const color of parsed.data.productColors) {
      const productColorId = await ctx.db.insert("productColors", {
        productId: productId,
        colorHex: color.colorHex,
        colorName: color.colorName,
        images: color.images,
      });
      for (const size of color.sizes) {
        await ctx.db.insert("productVariants", {
          productId: productId,
          size: size.size,
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
              .withIndex("by_productId", (q) => q.eq("productId", product._id))
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
                          imageUploadStatus: "uploaded",
                          imageKey: image,
                          imageUrl: await r2.getUrl(image),
                          imageId: image,
                        })),
                      )
                    : [],
                  sizes: variants.map((variant) => ({
                    size: variant.size,
                    quantity: variant.quantity,
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
