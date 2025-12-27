import { Merge } from "react-hook-form";
import { FieldError, FieldErrorsImpl } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { ImageInput, ProductFormData } from "@/schemas/schemas";
import useUploadImage from "@/hooks/useUploadImage";
import { useRef } from "react";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";




type ImageTileProps = {
  imageId: string;
  imageUrl: string;
  imageIndex: number;
  isEditing?: boolean;
  updatedImageKey: string;
  previews: { imageId: string; imageUrl: string }[];
  handleReplaceImage: (imageId: string, image: ImageInput) => boolean;
  handleRemoveImage: (imageId: string) => void;
  colorErrors?: Merge<FieldError, FieldErrorsImpl<ProductFormData["productColors"][number]>>;
}

const ImageTile = ({ imageId,imageIndex, imageUrl, updatedImageKey ,previews, handleReplaceImage, handleRemoveImage, colorErrors, isEditing }: ImageTileProps) => {

  const uploadFile = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteImage = useMutation(api.r2.removeImage);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) return toast.error("Le fichier dépasse la taille maximale autorisée 30 MB.")
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"].includes(file.type)) return toast.error("Le type de fichier n'est pas accepté.");
    try {
      const isImageDeleted = await deleteImage({ imageKey: updatedImageKey });
      if (!isImageDeleted.success) {
        return toast.error("Erreur lors de la suppression de l'ancienne image.");
      }
      const shouldAbort = handleReplaceImage(imageId, { imageId: file.name, imageUploadStatus: "uploading" });
      if (shouldAbort) return;
      const imageKey = await uploadFile(file);
      handleReplaceImage(file.name, { imageKey, imageUrl: URL.createObjectURL(file), imageUploadStatus: "success", imageId: file.name });
    } finally {
      fileInputRef.current!.value = "";
    }
  }

  const handleRemoveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isEditing && imageUrl.startsWith("blob:")) {
      const isImageDeleted = await deleteImage({ imageKey: updatedImageKey });
      if (!isImageDeleted.success) {
        return toast.error("Erreur lors de la suppression de l'image.");
      }
    }
    return handleRemoveImage(imageId);
  }

  return (
    <div
      key={imageId}
      className={cn(
        "relative group bg-background rounded-lg border-2 transition-colors overflow-hidden",
        colorErrors?.images?.[imageIndex]
          ? "border-destructive"
          : "border-border hover:border-primary/50",
      )}
    >
      <div className="aspect-square">
        <img
          src={previews[previews.findIndex(preview => preview.imageId === imageId)].imageUrl}
          alt={`Image ${imageId}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onChange={handleChange}
              ref={fileInputRef}
            />
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Upload className="w-4 h-4 text-foreground" />
            </div>
          </label>
          <button
            type="button"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleRemoveClick}
            className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageTile;
