import { getAvailablePortSync } from './dev_deps.ts'
import type { Server } from './types.ts'

/**
 * There doesn't seem to be a way to test express apps OOTB
 * with available tooling
 *
 * See https://github.com/cmorten/superdeno/issues/43
 *
 * So we've created a bare-bones simple harness that provides
 * an api for spinning up an express app, sending requests to it,
 * and spinning it back down.
 *
 * The idea is to run assertions on the Response object returned
 *
 * @param app - an express app to wrap with a test harness
 * @returns - the harness
 */
export const createHarness = (app: Server) => {
  // deno-lint-ignore no-explicit-any
  let server: any
  let _port: number

  /**
   * We try to stop the server if there's an unhandled rejection ie.
   * an assertion error, but there are no guarantees that this will fire in time
   * (see not on stop() below)
   */
  globalThis.addEventListener('unhandledrejection', () => {
    if (server) server.close()
  })

  /**
   * TODO: would be cool to accept a Request, but idk how to overwrite url
   *
   * so for now just implement subset of fetch api, accepting RequestInit
   * and overwrite url this way
   */
  const h = (path: string, init?: RequestInit) => fetch(`http://localhost:${_port}${path}`, init)

  h.start = (port = getAvailablePortSync()) =>
    new Promise<void>((resolve) => {
      _port = port || 3000
      server = app.listen(port, resolve)
    })
  /**
   * This HAS to be called before assertions and before the test ends
   * otherwise, Deno just outputs "FAILED" with no context as to why
   */
  h.stop = () => {
    return new Promise<void>((resolve) => {
      server.close(resolve)
      server = undefined
    })
  }
  h.root = () => {
    if (!server) throw new Error(`server not started`)
    return `http://localhost:${_port}`
  }

  return h
}

export const withTestHarness = (app: Server) =>
(
  testFn: (
    t: Deno.TestContext,
    harness: ReturnType<typeof createHarness>,
  ) => Promise<void>,
) =>
async (t: Deno.TestContext) => {
  const harness = createHarness(app)
  await harness.start()
  await testFn(t, harness).finally(() => harness.stop())
}