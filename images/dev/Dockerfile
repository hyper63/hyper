FROM denoland/deno:1.13.0

EXPOSE 6363

WORKDIR /app

USER deno

COPY hyper.config.js ./
COPY deps.js ./
COPY mod.js ./

RUN deno cache deps.js

RUN deno cache mod.js

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "mod.js"]

