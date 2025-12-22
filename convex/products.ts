import { internalMutation, mutation, query } from "./_generated/server";
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
        message: "User must be authenticated to create products",
        details: {
          root: "Please log as adminto create products",
        },
      });
    }
    const hasAccess = await checkPermission(ctx, userId, "admin");
    if (!hasAccess) {
      throw new ConvexError({
        code: "unauthorized",
        message: "User does not have permission to create products",
        details: {
          root: "You must be an admin to create products",
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
        message: "A product with this name already exists",
        details: {
          name: "Product name must be unique",
        },
      });
    }
    const category = await ctx.db.get("categories", args.category);
    if (!category) {
      throw new ConvexError({
        code: "not_found",
        message: "Category not found",
        details: {
          category: "The specified category does not exist",
        },
      });
    }
    const productId = await ctx.db.insert("products", {
      name: parsed.data.name,
      description: parsed.data.description,
      category: parsed.data.category as Id<"categories">,
      costPrice: parsed.data.costPrice,
      salePrice: parsed.data.salePrice,
    })
    for (const color of parsed.data.productColors) {
      const productColorId = await ctx.db.insert("productColors", {
        productId: productId,
        colorHex: color.colorHex,
        colorName: color.colorName,
        images: color.images,
      })
      for (const size of color.sizes) {
        await ctx.db.insert("productVariants", {
          productId: productId,
          size: size.size,
          quantity: size.quantity,
          productColor: productColorId,
        })
      }
    }
  },
});

// export const getGenerallProductsInfo = query({
//   args: {},
//   handler: async (ctx) => {
//     const userId = await getAuthUserId(ctx);
//     if (!userId) {
//       throw new ConvexError({
//         code: "unauthorized",
//         message: "User must be authenticated to view products",
//         details: {
//           root: "Please log in to view products",
//         },
//       });
//     }
//     const hasAccess = await checkPermission(ctx, userId, "admin");
//     if (!hasAccess) {
//       throw new ConvexError({
//         code: "unauthorized",
//         message: "User does not have permission to view products",
//         details: {
//           root: "You must be an admin to view products",
//         },
//       });
//     }
//     return {
//       totalProducts: (await ctx.db.query("products").collect()).length,
//       totalUnite: (await ctx.db.query("product_sizes").collect()).reduce(
//         (acc, size) => acc + size.quantity,
//         0,
//       ),
//       projectRevenue: (await ctx.db.query("price").collect()).reduce(
//         (acc, price) => acc + price.sale_price,
//         0,
//       ),
//     };
//   },
// });

// export const listProducts = query({
//   args: { paginationOpts: paginationOptsValidator },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx);
//     console.log("User ID:", userId);
//     if (!userId) {
//       throw new ConvexError({
//         code: "unauthorized",
//         message: "User must be authenticated to view products",
//         details: {
//           root: "Please log in to view products",
//         },
//       });
//     }
//     const hasAccess = await checkPermission(ctx, userId, "admin");
//     if (!hasAccess) {
//       throw new ConvexError({
//         code: "unauthorized",
//         message: "User does not have permission to view products",
//         details: {
//           root: "You must be an admin to view products",
//         },
//       });
//     }
//     const results = await ctx.db
//       .query("products")
//       .order("desc")
//       .paginate(args.paginationOpts);
//     const page = await Promise.all(
//       results.page.map(async (product) => {
//         const category = await ctx.db.get("categories", product.category);
//         if (!category) {
//           throw new ConvexError({
//             code: "not_found",
//             message: "Category not found for product",
//             details: {
//               category: "The specified category does not exist",
//             },
//           });
//         }
//         const price = await ctx.db
//           .query("price")
//           .withIndex("by_product", (q) => q.eq("product", product._id))
//           .first();
//         const colors = await ctx.db
//           .query("product_colors")
//           .withIndex("by_product", (q) => q.eq("product", product._id))
//           .collect();
//         const colorsWithSizes = await Promise.all(
//           colors.map(async (color) => {
//             const sizes = await ctx.db
//               .query("product_sizes")
//               .withIndex("by_product_color", (q) =>
//                 q.eq("product_color", color._id),
//               )
//               .collect();
//             return {
//               ...color,
//               sizes,
//             };
//           }),
//         );
//         return {
//           ...product,
//           category,
//           price: price || null,
//           colors: colorsWithSizes,
//         };
//       }),
//     );
//     return { ...results, page };
//   },
// });

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
