import { assert, assertEquals } from '../dev_deps.ts';

import { generateToken } from '../deps.deno.ts';
import { hyper, HYPER_LEGACY_GET_HEADER } from '../utils/hyper-request.ts';
import { HyperRequest } from '../types.ts';

Deno.test('hyper-request', async (t) => {
  await t.step('generateToken', async (t) => {
    await t.step('should generate a token successfully', async () => {
      try {
        const res = await generateToken('SUB', 'SECRET');
        assert(true);
        assertEquals(typeof res, 'string');
        // deno-lint-ignore no-explicit-any
      } catch (error: any) {
        assert(false, error.message);
      }
    });
  });

  await t.step('hyper', async (t) => {
    const req: HyperRequest = {
      service: 'data',
      method: 'GET',
    };

    await t.step('url', async (t) => {
      await t.step('it should append params', async () => {
        const resource = await hyper(
          new URL('cloud://mock.hyper.io/foobar'),
          'default',
        )({
          ...req,
          params: {
            foo: 'bar',
          },
        });
        assertEquals(
          resource.url,
          'https://mock.hyper.io/foobar/data/default?foo=bar',
        );
      });

      await t.step('isCloud', async (t) => {
        const cloudCs = 'cloud://mock.hyper.io/foobar';

        await t.step('should build the resource url correctly', async () => {
          const resource = await hyper(new URL(cloudCs), 'default')(req);
          assertEquals(
            resource.url,
            'https://mock.hyper.io/foobar/data/default',
          );
        });

        await t.step('should build the action url correctly', async () => {
          const action = await hyper(
            new URL(cloudCs),
            'default',
          )({ ...req, action: '_bulk' });
          assertEquals(
            action.url,
            'https://mock.hyper.io/foobar/data/default/_bulk',
          );
        });
      });

      await t.step('not isCloud', async (t) => {
        const notCloud = 'http://localhost:6363/foobar';

        await t.step('should build the resource url correctly', async () => {
          const resource = await hyper(new URL(notCloud), 'default')(req);
          assertEquals(resource.url, 'http://localhost:6363/data/foobar');
        });

        await t.step('should build the action url correctly', async () => {
          const action = await hyper(
            new URL(notCloud),
            'default',
          )({ ...req, action: '_bulk' });
          assertEquals(action.url, 'http://localhost:6363/data/foobar/_bulk');
        });
      });
    });

    await t.step('options', async (t) => {
      await t.step('headers', async (t) => {
        await t.step('should set the Authorization header', async () => {
          const resource = await hyper(
            new URL('http://foo:bar@localhost:6363/foobar'),
            'default',
          )(req);
          assert(resource.options?.headers.has('Authorization'));
        });

        await t.step('should set the Content-Type header', async () => {
          const resource = await hyper(
            new URL('http://foo:bar@localhost:6363/foobar'),
            'default',
          )(req);
          assert(resource.options?.headers.has('Content-Type'));
        });

        await t.step('should set any provided headers', async () => {
          const resource = await hyper(
            new URL('http://foo:bar@localhost:6363/foobar'),
            'default',
          )({
            ...req,
            headers: new Headers({ [HYPER_LEGACY_GET_HEADER]: 'true' }),
          });
          assert(resource.options?.headers.has(HYPER_LEGACY_GET_HEADER));
        });
      });

      await t.step('should add the body', async () => {
        const resource = await hyper(
          new URL('http://localhost:6363/foobar'),
          'default',
        )({ ...req, body: { foo: 'bar' } });
        assertEquals(resource.options?.body, JSON.stringify({ foo: 'bar' }));
      });

      await t.step('should add the method', async () => {
        const resource = await hyper(
          new URL('http://localhost:6363/foobar'),
          'default',
        )(req);
        assertEquals(resource.options?.method, 'GET');

        const resource2 = await hyper(
          new URL('http://localhost:6363/foobar'),
          'default',
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
        )({ ...req, method: undefined });
        assertEquals(resource2.options?.method, 'GET');
      });
    });
  });
});
