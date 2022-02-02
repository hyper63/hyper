import { $fetch } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

//const __dirname = new URL('.', import.meta.url).pathname;

const file = new File(['Hello World'], 'hello.txt')
const test = Deno.test;

export default function (storage) {
  const upload = (name, file) => $fetch(() => storage.upload(name, file));

  const cleanUp = (name) => $fetch(() => storage.remove(name));

  // test("POST /storage/:bucket successfully", () =>
  //   upload('rakis-dog.jpeg', file)
  //     .map((r) => (console.log(r), r))
  //     .map((r) => (assert(r.ok), 'rakis-dog.jpeg'))
  //     .chain(cleanUp)
  //     .toPromise()
  // );

  test("POST /storage/:bucket OK", () => {
     const fd = new FormData()
     fd.append('file', file)
    
    return fetch('http://localhost:6363/storage/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: fd
    })
    // return fetch('http://localhost:6363/storage/test/rakis-dog.jpeg')
    //   .then(r => (console.log(r), r))
  })
}
