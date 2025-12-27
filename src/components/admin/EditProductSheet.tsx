import { ProductData } from "@/pages/Products";
import { Category } from "./ProductForm";
import ProductForm from "./ProductForm";
import { Pencil } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getEditDefaultValues } from "@/lib/getEditDefaultValues";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema } from "@/schemas/schemas";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ProductFormData } from "@/schemas/schemas";
import SheetHeader from "./SheetHeader";


type EditProductSheetProps = {
  editProduct: ProductData | null;
  setEditProduct: React.Dispatch<React.SetStateAction<ProductData | null>>;
  categories: Category[];
};

const initialValues = {
  name: "",
  description: "",
  category: "",
  productColors: [
    {
      colorName: "",
      colorHex: "#000000",
      images: [],
      sizes: [{ size: "M", quantity: undefined }],
    },
  ],
  costPrice: undefined,
  salePrice: undefined,
};

const EditProductSheet = ({ editProduct, setEditProduct, categories, }: EditProductSheetProps) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: editProduct
      ? getEditDefaultValues(editProduct)
      : initialValues,
  });
  const deleteImage = useMutation(api.r2.removeImage);
  
  const handleClose = async () => {
    
    setEditProduct(null);
    const { isSubmitSuccessful } = form.formState;

    if (isSubmitSuccessful) return;
    const productColorsValues = form.getValues("productColors");


    const imagesToDelete = productColorsValues.flatMap(color => color.images).filter(img => img.imageUploadStatus === "success" && img.imageUrl && img.imageUrl.startsWith("blob:"));
    form.reset();

    console.log("deleting images:", imagesToDelete);
    await Promise.all(imagesToDelete.map(img => deleteImage({ imageKey: img.imageKey! })));
  }

  useEffect(() => {
    if (editProduct) {
      form.reset(getEditDefaultValues(editProduct));
    }
  }, [editProduct, form]);

  return (
    <Sheet
      open={!!editProduct}
      onOpenChange={handleClose}
    >
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
        <SheetHeader
          title="Modifier le Produit"
          description="Apportez des modifications à votre produit existant"
          icon={<Pencil className="w-6 h-6 text-primary-foreground" />}
        />


        <div className="flex-1 overflow-y-auto">
          {editProduct && (
            <ProductForm
              key={editProduct._id}
              categories={categories}
              isEdit={true}
              form={form}
              productId={editProduct._id}
            />
          )}
        </div>
        <div className="border-t-2 border-primary/20 bg-linear-to-b from-primary/5 to-background p-4 shrink-0">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              form="product-form"
              className="bg-primary hover:bg-primary/90 shadow-md"
              disabled={
                form.formState.isSubmitting ||
                form
                  .watch("productColors")
                  .some((color) =>
                    color.images.some(
                      (image) => image.imageUploadStatus === "uploading",
                    ),
                )
              }
            >
              {form.formState.isSubmitting ? <Spinner /> : "Mettre a jour"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditProductSheet;
