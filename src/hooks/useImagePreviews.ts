import { useEffect } from "react";
import { ImageInput } from "@/schemas/schemas";

export function useImagePreviews(images: ImageInput[]) {
  const previews = images.map((img) => ({ imageUrl: img.imageUrl, imageId: img.imageId }));
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.imageUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(img.imageUrl);
        }
      });
    };
  }, []);
  return previews;
}

export default useImagePreviews;
