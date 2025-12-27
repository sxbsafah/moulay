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

  const handleClose = async () => {

    setShowCreateSheet(false);
    const { isSubmitSuccessful } = form.formState;

    if (isSubmitSuccessful) return;
    const productColorsValues = form.getValues("productColors");


    const imagesToDelete = productColorsValues.flatMap(color => color.images).filter(img => img.imageUploadStatus === "success" && img.imageUrl && img.imageUrl.startsWith("blob:"));
    form.reset();

    console.log("deleting images:", imagesToDelete);
    await Promise.all(imagesToDelete.map(img => deleteImage({ imageKey: img.imageKey! })));
  }

  return (
    <Sheet open={showCreateSheet} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
        <div className="relative bg-linear-to-br from-primary via-primary/95 to-primary/90 border-b border-primary/20 px-6 py-6 shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-primary-foreground">
                Créer un Produit
              </h2>
              <p className="text-sm text-primary-foreground/80">
                Ajoutez un nouveau produit au catalogue
              </p>
            </div>
          </div>
        </div>

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
