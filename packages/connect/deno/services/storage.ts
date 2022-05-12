import { HyperRequestFunction, Method } from "../types.ts";

const service = "storage" as const;

interface Form {
  name: string;
  data: Uint8Array;
}

const createFormData = ({ name, data }: Form) => {
  const fd = new FormData();
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  fd.append("file", new File([data.buffer as ArrayBuffer], name));
  return fd;
};

export const upload = (name: string, data: Uint8Array) =>
  (h: HyperRequestFunction) =>
    Promise.resolve({ name, data })
      .then(createFormData)
      // need to override header to send content-type: multipart/form-data
      .then(async (fd) => {
        const req = await h({ service, method: Method.POST, body: fd });
        const headers = new Headers();
        headers.set(
          "Authorization",
          req.headers.get("authorization") as string,
        );
        return new Request(req.url, {
          method: Method.POST,
          body: fd,
          headers,
        });
      });

export const download = (name: string) =>
  async (h: HyperRequestFunction) => {
    const req = await h({ service, method: Method.GET, resource: name });
    const headers = new Headers();
    headers.set("Authorization", req.headers.get("authorization") as string);

    return new Request(req.url, {
      method: Method.GET,
      headers,
    });
  };

export const remove = (name: string) =>
  (h: HyperRequestFunction) =>
    h({ service, method: Method.DELETE, resource: name });
