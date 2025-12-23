
import { useUploadFile } from "@convex-dev/r2/react"
import { api } from "../../convex/_generated/api"
import compressImage from "@/lib/compressImages";

const useUploadImage = () => {
  const uploadFile = useUploadFile(api.r2);
  return async (file: File) => {
    return await uploadFile(await compressImage(file));
  }
}

export default useUploadImage;