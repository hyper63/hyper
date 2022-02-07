import { HyperRequestFunction, Method } from "../types";
import FormData from "form-data";
import { Headers, Request } from "node-fetch";

const service = "storage" as const;

interface Form {
  name: string;
  data: string | ReadableStream | Buffer;
}

const createFormData = ({ name, data }: Form) => {
  const fd = new FormData();
  fd.append("file", data, name);
  return fd;
};

export const upload = (name: string, data: string | ReadableStream | Buffer) =>
  (h: HyperRequestFunction) =>
    Promise.resolve({ name, data })
      .then(createFormData)
      // need to override header to send content-type: multipart/form-data
      .then(async (fd) => {
        const req = await h({ service, method: Method.POST, body: fd });
        const headers = new Headers();
        headers.set(
          "Authorization",
          req.headers.get("Authorization") as string,
        );
        return new Request(req.url, {
          method: Method.POST,
          headers,
          body: fd,
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
