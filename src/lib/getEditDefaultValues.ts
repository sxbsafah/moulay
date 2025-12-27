import { ProductData } from "@/pages/Products";
import { ProductFormData } from "@/schemas/schemas";

export const getEditDefaultValues = (product: ProductData,): ProductFormData => ({
  name: product.name,
  description: product.description,
  category: product.category._id, // string
  productColors: product.productColors.map((c) => ({
    colorName: c.colorName,
    colorHex: c.colorHex,
    productColorId: c._id,
    images: c.images.map((img) => ({
      imageUploadStatus: "success" as const,
      imageId: img.imageId,
      imageKey: img.imageKey,
      imageUrl: img.imageUrl,
    })),
    sizes: c.sizes.map((s) => ({
      size: s.size,
      quantity: s.quantity,
      productVariantId: s.variantId,
    })),
  })),
  costPrice: product.costPrice,
  salePrice: product.salePrice,
});
