# hyper dev image

## Docker container mode

```sh
docker pull hyper63/hyper-dev
docker run -it -p 6363:6363 --name hyper hyper63/hyper-dev
```

## Dev Mode

```sh
deno run --unstable --no-check --allow-env --allow-net --allow-read --allow-write=/tmp mod.js
```
