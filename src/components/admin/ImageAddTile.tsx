import { cn } from "@/lib/utils"; 
import { Plus } from "lucide-react";
import { ImageInput } from "@/schemas/schemas";
import useUploadImage from "@/hooks/useUploadImage";
import { useRef } from "react";
import { toast } from "sonner";



type ImageAddTileProps = {
  handleAddImage: (image: ImageInput) => boolean;
  handleReplaceImage: (imageId: string, image: ImageInput) => boolean;
}








const ImageAddTile = ({ handleAddImage, handleReplaceImage }: ImageAddTileProps) => {
  const uploadFile = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return
    if (file.size > 30 * 1024 * 1024) return toast.error("Le fichier dépasse la taille maximale autorisée.",);
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"].includes(file.type)) return toast.error(`Le type de fichier (${file.type}) n'est pas accepté.`);
    try {
      const shouldAbort = handleAddImage({ imageId: file.name, imageUploadStatus: "uploading" });
      if (shouldAbort) return;
      const imageKey = await uploadFile(file);
      handleReplaceImage(file.name, { imageKey, imageUrl: URL.createObjectURL(file), imageUploadStatus: "success", imageId: file.name });
    } finally {
      fileInputRef.current!.value = "";
    }
  }
  
  return (
    <label
      className={cn(
        "aspect-square flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 border-dashed transition-colors",
        "border-border hover:border-primary/50 hover:bg-muted/50",
        "bg-background",
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        className="hidden"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange={handleOnChange}
      />
      <Plus className="w-8 h-8 text-muted-foreground mb-2" />
      <span className="text-xs text-muted-foreground text-center px-2">
        Ajouter une image
      </span>
    </label>
  );
};

export default ImageAddTile;
