import { HyperRequestFunction, Method } from "../types.ts";

const service = "storage" as const;

interface Form {
  name: string;
  data: ReadableStream;
}

const createFormData = ({ name, data }: Form) => {
  const fd = new FormData();
  fd.append("name", name);
  // @ts-ignore dont know how to deal with data to assign to wanted type
  fd.append("file", data, name);
  return fd;
};

export const upload = (name: string, data: ReadableStream) =>
  (h: HyperRequestFunction) =>
    Promise.resolve({ name, data })
      .then(createFormData)
      // need to override header to send content-type: multipart/form-data
      .then((fd) => h({ service, method: Method.POST, body: fd }));

export const download = (name: string) =>
  (h: HyperRequestFunction) =>
    h({ service, method: Method.GET, resource: name });
