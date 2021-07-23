import { exists, MultipartReader, R } from "../deps.js";

const { compose, nth, split } = R;
const TMP_DIR = "/tmp/hyper/uploads";

const getBoundary = compose(
  nth(1),
  split("="),
  nth(1),
  split(";"),
);

export default function (fieldName = "file") {
  return async (req, _res, next) => {
    let boundary;

    const contentType = req.get("content-type");
    //console.log('contentType: ', contentType)
    if (contentType.startsWith("multipart/form-data")) {
      boundary = getBoundary(contentType);
    }
    //console.log('boundary: ', boundary)

    if (!(await exists(TMP_DIR))) {
      await Deno.mkdir(TMP_DIR, { recursive: true });
    }

    const form = await new MultipartReader(req.body, boundary).readForm({
      maxMemory: 10 << 20,
      dir: TMP_DIR,
    });

    //console.log('form', form.files(fieldName))

    req.file = form.files(fieldName)[0];

    next();
  };
}
