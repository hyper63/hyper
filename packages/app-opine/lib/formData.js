import { MultipartReader, R } from '../deps.js';
import { isMultipartFormData } from '../utils.js';

const { compose, nth, split } = R;
const TMP_DIR = '/tmp/hyper/uploads';

const getBoundary = compose(
  nth(1),
  split('='),
  nth(1),
  split(';'),
);

export default async (req, _res, next) => {
  let boundary;

  const contentType = req.get('content-type');
  if (isMultipartFormData(contentType)) boundary = getBoundary(contentType);

  try {
    await Deno.mkdir(TMP_DIR, { recursive: true });
  } catch (err) {
    if (!(err instanceof Deno.errors.AlreadyExists)) throw err;
    // dir exists, so do nothing
  }

  const form = await new MultipartReader(req.body, boundary).readForm({
    maxMemory: 10 << 20,
    dir: TMP_DIR,
  });

  req.form = form;

  next();
};
