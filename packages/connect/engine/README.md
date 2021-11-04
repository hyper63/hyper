

First start a local hyper server:
```
curl -O https://hyperland.s3.amazonaws.com/hyper
chmod +x hyper
./hyper
```

then run `deno run -A setup.ts` to create db and cache store

then run `deno run -A test.ts` to run hyper with plugin engine and single "data and cache" plugin
