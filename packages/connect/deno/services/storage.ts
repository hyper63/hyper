import { HyperRequestFunction, Method, StorageSignedUrlOptions } from '../types.ts'

const service = 'storage' as const

interface Form {
  name: string
  data: Uint8Array
}

const createFormData = ({ name, data }: Form) => {
  const fd = new FormData()
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  fd.append('file', new File([data.buffer as ArrayBuffer], name))
  return fd
}

export const upload = (name: string, data: Uint8Array) => (h: HyperRequestFunction) =>
  Promise.resolve({ name, data })
    .then(createFormData)
    // need to override header to send content-type: multipart/form-data
    .then(async (fd) => {
      const req = await h({ service, method: Method.POST, body: fd })
      const headers = new Headers()
      headers.set(
        'Authorization',
        req.headers.get('authorization') as string,
      )
      return new Request(req.url, {
        method: Method.POST,
        body: fd,
        headers,
      })
    })

export const download = (name: string) => async (hyper: HyperRequestFunction) => {
  const req = await hyper({
    service,
    method: Method.GET,
    resource: name,
  })
  /**
   * remove the  "Content-Type": "application/json" header,
   * but keep the Authorization header
   */
  const headers = new Headers()
  headers.set('Authorization', req.headers.get('authorization') as string)

  return new Request(req.url, {
    method: Method.GET,
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
