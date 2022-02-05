import { HyperRequestFunction, Method } from "../types";
import FormData from "form-data";
import { Request, Headers } from 'node-fetch';

const service = "storage" as const;

interface Form {
  name: string;
  data: string | ReadableStream | Buffer;
}

const createFormData = ({ name, data }: Form) => {
  const fd = new FormData();
  // @ts-ignore dont know how to deal with data to assign to wanted type
  fd.append("file", data, name);
  return fd;
};

export const upload = (name: string, data: string | ReadableStream  | Buffer) =>
  (h: HyperRequestFunction) =>
    Promise.resolve({ name, data })
      .then(createFormData)
      // need to override header to send content-type: multipart/form-data
      .then(async (fd) => {
        const req = await h({ service, method: Method.POST, body: fd });
        const headers = new Headers()
        headers.set('Authorization', req.headers.get('Authorization') as string)
        return new Request(req.url, {
          method: Method.POST,
          headers,
          body: fd,
        });
      });

export const download = (name: string) =>
  (h: HyperRequestFunction) =>
    h({ service, method: Method.GET, resource: name });
