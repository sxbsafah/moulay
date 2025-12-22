/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  X,
  FileText,
  Palette,
  Tag,
  Ruler,
  Hash,
  Upload,
  ImagePlus,
  Euro,
} from "lucide-react";
import { productFormSchema, type ProductFormData } from "@/schemas/schemas";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import FormErrors from "../FormErrors";
import { ConvexError } from "convex/values";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { handleErrors } from "@/lib/handleErrors";
import { useUploadFile } from "@convex-dev/r2/react";
import compressImage from "@/lib/compressImages";
import useImagePreviews from "@/hooks/useImagePreviews";
import pLimit from "p-limit";
import { useWatch } from "react-hook-form";


type Category = {
  _id: string;
  name: string;
};

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  categories: Category[];
  isEdit?: boolean;
  setShowCreateSheet?: React.Dispatch<React.SetStateAction<boolean>>;
}

const limit = pLimit(3);

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

export default function ProductForm({ defaultValues, categories, setShowCreateSheet, isEdit }: ProductFormProps) {

  const createProduct = useMutation(api.products.createProduct);
  const form = useForm<ProductFormData>({ resolver: zodResolver(productFormSchema), defaultValues: defaultValues ?? initialValues, });
  const uploadImage = useUploadFile(api.r2);
  const { fields: colorFields, append: appendColor, remove: removeColor, } = useFieldArray({ control: form.control, name: "productColors", });

  const watchCostPrice = useWatch({ control: form.control, name: "costPrice", });
  const watchSalePrice = useWatch({ control: form.control, name: "salePrice", });

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
      const productColorsWithImages = await Promise.all(
        data.productColors.map(async (color) => {
          const colorImageKeys = await Promise.all(
            color.images.map(async (image) => {
              return limit(async () => {
                if (!(image instanceof File)) return null;
                const compressedImage = await compressImage(image);
                return await uploadImage(compressedImage);
              });
            }),
          );

          return {
            colorName: color.colorName,
            colorHex: color.colorHex,
            images: colorImageKeys.filter((key): key is string => key !== null),
            sizes: color.sizes.map((s) => ({
              size: s.size,
              quantity: s.quantity,
            })),
          };
        }),
      );

      await createProduct({
        name: data.name,
        description: data.description,
        category: "k97dch5nks59ma58f3cbfxzs9s7xmxz3" as Id<"categories">,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        productColors: productColorsWithImages,
      });

      setShowCreateSheet?.(false);
    } catch (error) {
      console.log(error);
      if (error instanceof ConvexError) {
        handleErrors(error, form.setError);
      }
    }
  };

  const handleSubmitEdit = (data: ProductFormData) => {};

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
      <div className="border-t border-border bg-background p-4 shrink-0">
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              if (setShowCreateSheet) {
                setShowCreateSheet(false);
              }
            }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            form="product-form"
            className="bg-primary hover:bg-primary/90 min-w-30"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner />
            ) : defaultValues ? (
              "Modifier le Produit"
            ) : (
              "Créer le Produit"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

interface ColorVariantFormProps {
  colorIndex: number;
  form: UseFormReturn<ProductFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

function ColorVariantForm({ colorIndex, form, onRemove, canRemove, }: ColorVariantFormProps) {
  const { fields: sizeFields, append: appendSize, remove: removeSize, } = useFieldArray({ control: form.control, name: `productColors.${colorIndex}.sizes`,});
  const colorImages = useWatch({ control: form.control, name: `productColors.${colorIndex}.images`, });
  const colorHex = useWatch({ control: form.control, name: `productColors.${colorIndex}.colorHex`, });
  const colorName = useWatch({ control: form.control, name: `productColors.${colorIndex}.colorName`, });
  const colorErrors = form.formState.errors.productColors?.[colorIndex];
  const previews = useImagePreviews(colorImages);
  const handleAddImage = (file: File) => {
    const currentImages = form.getValues(`productColors.${colorIndex}.images`) || [];
    form.setValue( `productColors.${colorIndex}.images`, [...currentImages, file],{ shouldValidate: true, }, );
  };

  const handleReplaceImage = (imageIndex: number, file: File) => {
    const currentImages = form.getValues(`productColors.${colorIndex}.images`) || [];
    const newImages = [...currentImages];
    newImages[imageIndex] = file;
    form.setValue(`productColors.${colorIndex}.images`, newImages, { shouldValidate: true, });
  };

  const handleRemoveImage = (imageIndex: number) => {
    const currentImages = form.getValues(`productColors.${colorIndex}.images`) || [];
    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    form.setValue(`productColors.${colorIndex}.images`, newImages, { shouldValidate: true, });
  };
  const validImagesCount = colorImages.filter( (img) => img instanceof File || typeof img === "string", ).length;

  return (
    <div className="bg-muted/30 rounded-xl overflow-hidden">
      <div className="bg-muted/50 px-5 py-3 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg border-2 border-background shadow-sm"
            style={{ backgroundColor: colorHex }}
          />
          <span className="font-medium text-sm">
            {colorName || `Couleur ${colorIndex + 1}`}
          </span>
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`productColors.${colorIndex}.colorName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la couleur</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Noir, Bleu Marine..."
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`productColors.${colorIndex}.colorHex`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5" />
                  Code Hex
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={field.onChange}
                      className="w-12 h-10 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <Input
                      {...field}
                      placeholder="#000000"
                      className="flex-1 bg-background font-mono"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel className="flex items-center gap-2">
              <ImagePlus className="w-3.5 h-3.5" />
              Images ({validImagesCount})
            </FormLabel>
          </div>

          {colorErrors?.images?.message && (
            <p className="text-sm text-destructive">
              {String(colorErrors.images.message)}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {colorImages.map((image, imageIndex) => (
              <div
                key={imageIndex}
                className={cn(
                  "relative group bg-background rounded-lg border-2 transition-colors overflow-hidden",
                  colorErrors?.images?.[imageIndex]
                    ? "border-destructive"
                    : "border-border hover:border-primary/50",
                )}
              >
                <div className="aspect-square">
                  <img
                    src={previews[imageIndex]}
                    alt={`Image ${imageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReplaceImage(imageIndex, file);
                        }}
                      />
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <Upload className="w-4 h-4 text-foreground" />
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(imageIndex)}
                      className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <label
              className={cn(
                "aspect-square flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 border-dashed transition-colors",
                "border-border hover:border-primary/50 hover:bg-muted/50",
                "bg-background",
              )}
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddImage(file);
                }}
              />
              <Plus className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground text-center px-2">
                Ajouter une image
              </span>
            </label>
          </div>

          <p className="text-xs text-muted-foreground">
            Formats acceptés: JPG, PNG, WebP. Taille max: 30MB
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel className="flex items-center gap-2">
              <Ruler className="w-3.5 h-3.5" />
              Tailles & Stock
            </FormLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendSize({ size: "", quantity: 0 })}
              className="h-8 gap-1.5 text-primary"
            >
              <Plus className="h-3 w-3" />
              Ajouter
            </Button>
          </div>

          {colorErrors?.sizes?.message && (
            <p className="text-sm text-destructive">
              {String(colorErrors.sizes.message)}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {sizeFields.map((sizeField, sizeIndex) => {
              const sizeErrors = colorErrors?.sizes?.[sizeIndex];
              return (
                <div
                  key={sizeField.id}
                  className={cn(
                    "flex gap-2 items-center bg-background rounded-lg p-3 border",
                    sizeErrors ? "border-destructive" : "border-border/50",
                  )}
                >
                  <FormField
                    control={form.control}
                    name={`productColors.${colorIndex}.sizes.${sizeIndex}.size`}
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Taille"
                          className="w-14 h-8 text-center font-medium border-0 bg-transparent p-0"
                        />
                      </FormControl>
                    )}
                  />
                  <span className="text-muted-foreground text-sm">×</span>
                  <FormField
                    control={form.control}
                    name={`productColors.${colorIndex}.sizes.${sizeIndex}.quantity`}
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Qté"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? 0 : parseInt(value, 10),
                            );
                          }}
                          className="flex-1 h-8 border-0 bg-transparent"
                        />
                      </FormControl>
                    )}
                  />
                  {sizeFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSize(sizeIndex)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export { type ProductFormData };
