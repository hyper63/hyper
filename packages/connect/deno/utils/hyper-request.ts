import { HyperRequest, Method } from '../types.ts'
import { generateToken, R } from '../deps.deno.ts'

const { assoc } = R

interface RequestOptions {
  body?: BodyInit
  headers: Headers
  method: Method
}

interface HyperRequestParams {
  url: string
  options?: RequestOptions
}

export const HYPER_LEGACY_GET_HEADER = 'X-HYPER-LEGACY-GET'

/**
 * This is a shim to support https://github.com/hyper63/hyper/issues/566
 *
 * We take fetch, and a Request object and split the Request object into
 * it url and RequestInit pieces to pass to Request
 */
export const fetchWithShim = (f: typeof fetch) =>
/**
 * Technically we should be able to pass the Request
 * as the RequestInit https://github.com/whatwg/fetch/issues/1486
 *
 * But I am honestly worried that wouldn't work when transpiled to Node,
 * so just manually build out the RequestInit for now.
 */
(req: Request): Promise<Response> =>
  f(req.url, {
    headers: req.headers,
    method: req.method,
    /**
     * duplex needed for node
     * See https://github.com/nodejs/node/issues/46221
     */
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    ...(req.body ? { body: req.body, duplex: true } : {}),
  })

export const hyper = (conn: URL, domain: string) =>
async ({
  service,
  method,
  headers,
  resource,
  body,
  params,
  action,
}: HyperRequest): Promise<HyperRequestParams> => {
  const isCloud = /^cloud/.test(conn.protocol)
  const protocol = isCloud ? 'https:' : conn.protocol

  let options = {
    headers: new Headers({
      ...(headers ? Object.fromEntries(headers.entries()) : {}),
      'Content-Type': 'application/json',
    }),
    method: method ? method : Method.GET,
  } as RequestOptions

  if (body) {
    options = assoc('body', JSON.stringify(body), options) as RequestOptions
  }

  if (conn.username && conn.password) {
    const token = await generateToken(conn.username, conn.password)
    options.headers = new Headers({
      ...Object.fromEntries(options.headers.entries()),
      Authorization: `Bearer ${token}`,
    })
  }
  const pathname = isCloud ? conn.pathname : ''
  const appdomain = isCloud ? '/' + domain : conn.pathname

  let url = `${protocol}//${conn.host}${pathname}/${service}${appdomain}`

  if (service === 'info') {
    url = `${protocol}//${conn.host}`
  }

  if (resource) url += `/${resource}`
  else if (action) url += `/${action}`

  if (params) {
    url += `?${new URLSearchParams(params).toString()}`
  }

  return { url, options }
}
