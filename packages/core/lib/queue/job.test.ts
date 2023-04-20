// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { assertEquals } from '../../dev_deps.ts'

import * as job from './job.ts'

const mockService = {
  post({ name, job }: any) {
    return Promise.resolve({ ok: true, name, job })
  },
  cancel({ name, id }: any) {
    return Promise.resolve({ ok: true, name, id })
  },
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('queue - job', async (t) => {
  await t.step('post', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await job
        .post({ name: 'foobar', job: { type: 'FOO_JOB' } })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
          // @ts-expect-error
          assertEquals(res.job, { type: 'FOO_JOB' })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('cancel', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await job
        .cancel({ name: 'foobar', id: '1234' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '1234')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })
})
