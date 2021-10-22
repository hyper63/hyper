import { hyper } from "./request.js";
import dataAPI from "./data.js";
import cacheAPI from "./cache.js";
import searchAPI from "./search.js";

export default function connect(s) {
  const conn = new URL(s);

  return function (domain = "default") {
    /**
     * @param {hyperRequest}
     */
    const h = async (hyperRequest) => {
      const { url, options } = await hyper(conn, domain)(hyperRequest);
      const req = new Request(url, options);

      return await fetch(req).then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          return r.text().then((txt) => ({
            ok: r.ok,
            code: r.status,
            body: txt,
          }));
        }
      });
    };

    return {
      data: dataAPI(h),
      cache: cacheAPI(h),
      search: searchAPI(h),
      //queue: queueAPI(h)
    };
  };
}
