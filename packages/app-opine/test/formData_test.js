import { opine } from '../deps.js';
import { assert, superdeno } from '../dev_deps.js';

import formData from '../lib/formData.js';

Deno.test('formData', async (t) => {
  const app = opine();
  app.put('/foo/bar', formData, (req, res) => {
    res.json({ form: !!req.form });
  });

  await t.step('should parse the FormData', async () => {
    const on = await superdeno(app)
      .put('/foo/bar')
      .attach('file', Deno.readFileSync('hyper63-logo.png'), 'image.png');

    assert(on.body.form);
  });
});
