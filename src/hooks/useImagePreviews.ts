import { useEffect, useRef, useState } from "react";

export function useImagePreviews(files: (File | string)[]) {
  const [previews, setPreviews] = useState<string[]>([]);
  const urlCacheRef = useRef<Map<File, string>>(new Map());

  useEffect(() => {
    const newPreviews: string[] = [];
    const currentCache = urlCacheRef.current;
    const usedFiles = new Set<File>();

    files.forEach((file) => {
      if (file instanceof File) {
        usedFiles.add(file);

        // Reuse existing blob URL if we have it
        if (currentCache.has(file)) {
          newPreviews.push(currentCache.get(file)!);
        } else {
          // Create new blob URL only for new files
          const url = URL.createObjectURL(file);
          currentCache.set(file, url);
          newPreviews.push(url);
        }
      } else {
        newPreviews.push(file);
      }
    });

    // Cleanup URLs for files that are no longer in use
    currentCache.forEach((url, file) => {
      if (!usedFiles.has(file)) {
        URL.revokeObjectURL(url);
        currentCache.delete(file);
      }
    });

    setPreviews(newPreviews);
  }, [files]);

  // Cleanup all URLs on unmount
  useEffect(() => {
    return () => {
      urlCacheRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      urlCacheRef.current.clear();
    };
  }, []);

  return previews;
}

export default useImagePreviews;
