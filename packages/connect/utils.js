import { crocks, R, signJWT } from "./deps.js";

const { Async } = crocks;
const { assoc, lensPath, over } = R;

export const buildRequest = (cs) =>
  (service) => {
    const createToken = (u, p) =>
      signJWT({ alg: "HS256", type: "JWT" }, { sub: u }, p);

    return Async.of({
      url: "",
      headers: "",
      isHyperCloud: cs.protocol === "cloud:",
    })
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
      .map(({ headers, isHyperCloud }) =>
        new Request(
          `${
            isHyperCloud
              ? "https:"
              : cs.protocol
          }//${cs.host}${isHyperCloud ? cs.pathname : ""}${"/" + service}${
            !isHyperCloud ? cs.pathname : ""
          }`,
          {
            headers,
          },
        )
      );
  };
