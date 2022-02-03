import { HyperRequestFunction, Method } from "../types.ts";

const service = "storage" as const;

interface Form {
  name: string;
  data: ReadableStream;
}

const createFormData = ({ name, data }: Form) => {
  const fd = new FormData();
  // @ts-ignore dont know how to deal with data to assign to wanted type
  fd.append("file", data, name);
  return fd;
};

export const upload = (name: string, data: ReadableStream) =>
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
