import { getMimeType } from '../deps.deno.ts'
import { HyperRequestFunction, Method, StorageSignedUrlOptions } from '../types.ts'

const service = 'storage' as const

export const upload = (name: string, data: ReadableStream) => async (h: HyperRequestFunction) => {
  const req = await h({ service, method: Method.POST, resource: name })
  /**
   * remove the  "Content-Type": "application/json" header,
   * but keep the Authorization header
   */
  const headers = new Headers()
  headers.set('Authorization', req.headers.get('authorization') as string)
  headers.set('Content-Type', getMimeType(name) || 'application/octet-stream')

  return new Request(req.url, {
    method: req.method,
    headers,
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    body: data,
    /**
     * duplex needed for node
     * See https://github.com/nodejs/node/issues/46221
     */
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    duplex: 'half',
  })
}

export const download = (name: string) => async (hyper: HyperRequestFunction) => {
  const req = await hyper({ service, method: Method.GET, resource: name })
  /**
   * remove the  "Content-Type": "application/json" header,
   * but keep the Authorization header
   */
  const headers = new Headers()
  headers.set('Authorization', req.headers.get('authorization') as string)

  return new Request(req.url, {
    method: req.method,
    headers,
  })
}

export const signedUrl =
  (name: string, options: StorageSignedUrlOptions) => (h: HyperRequestFunction) =>
    h({
      service,
      resource: name,
      method: options.type === 'download' ? Method.GET : Method.POST,
      params: { useSignedUrl: true },
    })

export const remove = (name: string) => (h: HyperRequestFunction) =>
  h({ service, method: Method.DELETE, resource: name })

export const create = () => (hyper: HyperRequestFunction) => hyper({ service, method: Method.PUT })

export const destroy = (confirm?: boolean) => (hyper: HyperRequestFunction) =>
  confirm
    ? hyper({ service, method: Method.DELETE })
    : Promise.reject({ ok: false, msg: 'request not confirmed!' })
