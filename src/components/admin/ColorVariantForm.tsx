
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
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
  Ruler,
  Hash,
  ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useImagePreviews from "@/hooks/useImagePreviews";
import { useWatch } from "react-hook-form";
import { ProductFormData } from "@/schemas/schemas";
import ImageTile from "./ImageTile";
import ImageAddTile from "./ImageAddTile";
import { ImageInput } from "@/schemas/schemas";
import { Fragment } from "react/jsx-runtime";





type ColorVariantFormProps  = {
  colorIndex: number;
  isEdit?: boolean;
  form: UseFormReturn<ProductFormData>;
  onRemove: () => void;
  canRemove: boolean;
}



function ColorVariantForm({ colorIndex, form, isEdit, onRemove, canRemove, }: ColorVariantFormProps) {

  const { fields: sizeFields, append: appendSize, remove: removeSize, } = useFieldArray({ control: form.control, name: `productColors.${colorIndex}.sizes`,});
  const colorImages = useWatch({ control: form.control, name: `productColors.${colorIndex}.images`, });
  const colorHex = useWatch({ control: form.control, name: `productColors.${colorIndex}.colorHex`, });
  const colorName = useWatch({ control: form.control, name: `productColors.${colorIndex}.colorName`, });
  const colorErrors = form.formState.errors.productColors?.[colorIndex];
  const previews = useImagePreviews(colorImages);


  const handleAddImage = (image: ImageInput) => {
    const currentImages = form.getValues(`productColors.${colorIndex}.images`) || [];
    if (currentImages.find((img) => img.imageId === image.imageId)) return true;
    form.setValue(`productColors.${colorIndex}.images`, [...currentImages, image], { shouldValidate: true, },);
    return false;
  };

  const handleReplaceImage = (imageId: string , image: ImageInput) => {
    const currentImages = form.getValues(`productColors.${colorIndex}.images`) || [];
    const newImages = [...currentImages];
    const imageIndex = newImages.findIndex(img => img.imageId === imageId);
    if (currentImages.find((img) => img.imageId === image.imageId && img.imageId !== imageId)) return true;
    
    if (imageIndex !== -1) {
      newImages[imageIndex] = image;
    }
    form.setValue(`productColors.${colorIndex}.images`, newImages, { shouldValidate: true, });
    return false
  };

  const handleRemoveImage = (imageId: string) => {
    const currentImages = form.getValues(`productColors.${colorIndex}.images`) || [];
    const newImages = currentImages.filter((img) => img.imageId !== imageId);
    form.setValue(`productColors.${colorIndex}.images`, newImages, { shouldValidate: true, });
  };


  const validImagesCount = colorImages.filter((img) => typeof img === "string" || (img && typeof img === "object" && "imageKey" in img),).length;
  
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
              <Fragment key={image.imageId}>
                {image.imageUploadStatus === "success" && image.imageUrl && (
                  <ImageTile imageUrl={image.imageUrl} isEditing={isEdit} imageId={image.imageId} imageIndex={imageIndex} previews={previews as { imageId: string; imageUrl: string }[]} handleReplaceImage={handleReplaceImage} handleRemoveImage={handleRemoveImage} colorErrors={colorErrors} updatedImageKey={image.imageKey as string}  />
                )}
                {image.imageUploadStatus === "uploading" && (
                  <div
                    key={image.imageId}
                    className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed bg-background animate-pulse"
                  >
                    <span className="text-sm text-muted-foreground">Téléchargement...</span>
                  </div>
                )}
              </Fragment>
            ))}
            <ImageAddTile handleReplaceImage={handleReplaceImage}  handleAddImage={handleAddImage} />

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

export default ColorVariantForm;  