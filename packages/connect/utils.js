import { crocks, R, signJWT } from "./deps.js";

const { Async } = crocks;
const { assoc, lensPath, over, ifElse, defaultTo, identity } = R;

export const buildRequest = (cs) =>
  (service, domain) => {
    const createToken = (u, p) =>
      signJWT({ alg: "HS256", type: "JWT" }, { sub: u }, p);
    let app = cs.pathname;
    if (service === "_root") {
      app = "";
      service = "";
    }

    return Async.of({
      url: "",
      headers: "",
      isHyperCloud: cs.protocol === "cloud:",
      domain,
    })
      .map((request) =>
        over(
          lensPath(["domain"]),
          ifElse(
            () => request.isHyperCloud,
            defaultTo("default"), // hyper cloud defaults service names to 'default'
            identity,
          ),
          request,
        )
      )
      .map(assoc("headers", { "Content-Type": "application/json" }))
      .chain((request) =>
        cs.password !== ""
          ? Async.fromPromise(createToken)(cs.username, cs.password)
            .map((token) =>
              over(lensPath(["headers", "authorization"]), (_) =>
                `Bearer ${token}`, request)
            )
          : Async.Resolved(request)
      )
      .map(({ headers, isHyperCloud, domain }) =>
        new Request(
          `${
            isHyperCloud
              ? "https:"
              : cs.protocol
          }//${cs.host}${isHyperCloud ? app : ""}${
            service !== "" ? "/" + service : ""
          }${!isHyperCloud ? app : "/"}${domain ? domain : ""}`,
          {
            headers,
          },
        )
      );
  };
