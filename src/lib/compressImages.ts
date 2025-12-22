import Compressor from "compressorjs";

const compressImage = async (image: File) => {
  return new Promise<File>((resolve, reject) => {
    return new Compressor(image, {
      quality: 0.8,
      success: (result) => {
        resolve(result as File);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
};


export default compressImage;
