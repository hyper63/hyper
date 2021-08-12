FROM denoland/deno:1.13.0

EXPOSE 6363

WORKDIR /app

USER deno

COPY hyper.config.js ./
COPY deps.js ./
COPY mod.js ./

RUN deno cache --unstable --no-check deps.js

RUN deno cache --unstable --no-check mod.js

CMD ["run", "--unstable", "--no-check", "--allow-env", "--allow-net", "--allow-read", "--allow-write=/tmp", "mod.js"]

