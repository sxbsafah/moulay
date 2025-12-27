import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, ProductFormData } from "@/schemas/schemas";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import ProductForm from "./ProductForm";
import { Category } from "./ProductForm";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {  useEffect } from "react";
import SheetHeader from "@/components/admin/SheetHeader";



type CreateProductSheetProps = {
  setShowCreateSheet: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateSheet: boolean;
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

const CreateProductSheet = ({ setShowCreateSheet, showCreateSheet, categories, }: CreateProductSheetProps) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues,
  });
  const deleteImage = useMutation(api.r2.removeImage);


  useEffect(() => {
    if (showCreateSheet) {
      form.reset(initialValues);
   }
  }, [showCreateSheet]);
  


  const handleClose = async () => {

    setShowCreateSheet(false);
    const { isSubmitSuccessful } = form.formState;

    if (isSubmitSuccessful) return;
    const productColorsValues = form.getValues("productColors");


    const imagesToDelete = productColorsValues.flatMap(color => color.images).filter(img => img.imageUploadStatus === "success" && img.imageUrl && img.imageUrl.startsWith("blob:"));
    console.log("deleting images:", imagesToDelete);
    await Promise.all(imagesToDelete.map(img => deleteImage({ imageKey: img.imageKey! })));
  }

  return (
    <Sheet open={showCreateSheet} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
        <SheetHeader
          title="Créer un Nouveau Produit"
          description="Ajoutez un nouveau produit à votre catalogue."
          icon={<Plus className="w-6 h-6 text-primary-foreground" />}
        />

        <ProductForm categories={categories} isEdit={false} form={form} />

        <div className="border-t-2 border-primary/20 bg-linear-to-b from-primary/5 to-background p-4 shrink-0">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              form="product-form"
              className="bg-primary hover:bg-primary/90 min-w-30"
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
              {form.formState.isSubmitting ? <Spinner /> : "Créer le Produit"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateProductSheet;
