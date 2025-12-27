/* eslint-disable @typescript-eslint/no-misused-promises */

import {  useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  FileText,
  Palette,
  Tag,
  Euro,
} from "lucide-react";
import {  type ProductFormData } from "@/schemas/schemas";
import FormErrors from "../FormErrors";
import { ConvexError } from "convex/values";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { handleErrors } from "@/lib/handleErrors";
import { useWatch } from "react-hook-form";
import ColorVariantForm from "./ColorVariantForm";
import { toast } from "sonner";


export type Category = {
  _id: string;
  name: string;
};

export type ProductFormProps = {
  form: UseFormReturn<ProductFormData>;
  categories: Category[];
  isEdit?: boolean;
  productId?: Id<"products">;
}




export default function ProductForm({ categories, isEdit, form, productId}: ProductFormProps) {

  const createProduct = useMutation(api.products.createProduct);
  const { fields: colorFields, append: appendColor, remove: removeColor, } = useFieldArray({ control: form.control, name: "productColors", });
  const watchCostPrice = useWatch({ control: form.control, name: "costPrice", });
  const watchSalePrice = useWatch({ control: form.control, name: "salePrice", });
  const updateProduct = useMutation(api.products.updateProduct);

  const handleAddColor = () => {
    appendColor({
      colorName: "",
      colorHex: "#000000",
      images: [],
      sizes: [{ size: "M", quantity: 0 }],
    });
  };

  const handleSubmitCreate = async (data: ProductFormData) => {
    try {

      await createProduct({
        name: data.name,
        description: data.description,
        category: data.category as Id<"categories">,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        productColors: data.productColors.map((color) => ({
          ...color,
          images: color.images.map((img) => img.imageKey!),
        }))
      });
      toast.success("Produit créé avec succès !");
    } catch (error) {
      console.log(error);
      if (error instanceof ConvexError) {
        handleErrors(error, form.setError);
      }
    }
  };

  const handleSubmitEdit = async (data: ProductFormData) => {
    console.log("Edit submit data:", data);
    try {
      if (isEdit && productId) {
        await updateProduct({
          productId: productId,
          name: data.name,
          description: data.description,
          category: data.category as Id<"categories">,
          costPrice: data.costPrice,
          salePrice: data.salePrice,
          productColors: data.productColors.map((color) => ({
            ...color,
            productColorId: color.productColorId as Id<"productColors">,
            images: color.images.map((img) => img.imageKey!),
            sizes: color.sizes.map((size) => ({
              ...size,
              productVariantId: size.productVariantId as Id<"productVariants">,
            })),
          }))
        });
      }
      toast.success("Produit mis à jour avec succès !");
    } catch (error) {
      console.log(error);
      if (error instanceof ConvexError) {
        handleErrors(error, form.setError);
      }
    }
  };

  const calculateMargin = () => {
    const cost = Number(watchCostPrice) || 0;
    const sale = Number(watchSalePrice) || 0;
    if (cost && sale && sale > 0) {
      return Math.round(((sale - cost) / sale) * 100);
    }
    return 0;
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <Form {...form}>
          <form
            id="product-form"
            onSubmit={form.handleSubmit(
              isEdit ? handleSubmitEdit : handleSubmitCreate,
            )}
            className="p-6 space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                Informations de Base
              </div>

              <div className="bg-muted/30 rounded-xl p-5 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du produit</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Blazer Laine Premium"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Décrivez votre produit en détail..."
                          rows={3}
                          className="bg-background resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" />
                        Catégorie
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <Euro className="w-4 h-4" />
                Tarification
              </div>

              <div className="bg-muted/30 rounded-xl p-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix de Coût</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="120"
                              className="bg-background pr-8"
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? "" : Number(value),
                                );
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              DZ
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix de Vente</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="299"
                              className="bg-background pr-8"
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? "" : Number(value),
                                );
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              DZ
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {(watchCostPrice !== undefined && watchCostPrice !== 0) ||
                (watchSalePrice !== undefined && watchSalePrice !== 0) ? (
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Marge bénéficiaire
                    </span>
                    <span className="font-medium text-primary">
                      {calculateMargin()}%
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                Variantes du Produit
              </div>

              {form.formState.errors.productColors?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.productColors.message}
                </p>
              )}

              {colorFields.map((colorField, colorIndex) => (
                <ColorVariantForm
                  key={colorField.id}
                  colorIndex={colorIndex}
                  isEdit={isEdit}
                  form={form}
                  onRemove={() => removeColor(colorIndex)}
                  canRemove={colorFields.length > 1}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddColor}
                className="w-full gap-2 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Ajouter une couleur
              </Button>
            </div>
            <FormErrors errors={form.formState.errors} />
          </form>
        </Form>
      </div>
    </>
  );
}




