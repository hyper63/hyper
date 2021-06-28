import { exists, MultipartReader } from "../deps.js";

// Upload middleware for handling multipart/formdata ie. files
export function multipartMiddleware(fieldName = "file") {
  const TMP_DIR = "/tmp/hyper/uploads";

  return async (req, _res, next) => {
    let boundary;

    const contentType = req.get("content-type");
    if (contentType.startsWith("multipart/form-data")) {
      boundary = contentType.split(";")[1].split("=")[1];
    }

    // Ensure tmp dir exists. Otherwise MultipartReader throws error when reading form data
    if (!(await exists(TMP_DIR))) {
      await Deno.mkdir(TMP_DIR, { recursive: true });
    }

    const form = await new MultipartReader(req.body, boundary).readForm({
      maxMemory: 10 << 20,
      dir: TMP_DIR,
    });

    // emulate multer
    req.file = form.file(fieldName);

    next();
  };
}
