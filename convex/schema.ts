import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({

  products: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.id("categories"),
    costPrice: v.number(),
    salePrice: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_name", ["name"]),
  productVariants: defineTable({
    productId: v.id("products"),
    size: v.string(),
    quantity: v.number(),
    productColor: v.id("productColors"),
  }).index("by_product", ["productId"])
    .index("by_product_color", ["productId", "productColor"]),
  productColors: defineTable({
    productId: v.id("products"),
    colorName: v.string(),
    colorHex: v.string(),
    images: v.array(v.string()),
  }).index("by_product", ["productId"]),
  categories: defineTable({
    name: v.string(),
  })
    .index("by_name", ["name"]),
});
