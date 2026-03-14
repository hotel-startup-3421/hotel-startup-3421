import { registerAs } from "@nestjs/config";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";

export default registerAs("multer", () => ({
  dest: process.env.MULTER_DEST || "./uploads",
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), 
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
}));

export const multerStorage = diskStorage({
  destination: process.env.MULTER_DEST || "./uploads",
  filename: (_req, file, cb) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});