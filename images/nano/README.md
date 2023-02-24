<h1 align="center">⚡️ hyper {nano} ⚡️</h1>
<p align="center">
  hyper nano version is a standalone developer instance of hyper, this version gives you
  the ability to run hyper locally with no config setup.
</p>

---

## Table of Contents

- [Motivation](#motivation)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## Motivation

A core tenant of the hyper service framework is that an application should not need to care about
the underlying service implementation. By building an application to consume an api, your
appliation, and ergo your business logic, is kept separate and decoupled from the services that
power it.

> Learn more about [Clean Architecture](https://blog.hyper.io/the-perfect-application-architecture/)

This allows for _swapping out_ the service api implementations, without having to change business
logic. `hyper-nano` is an embodiment of this approach.

`hyper nano` is an instance of hyper running an `http` based api, and a set of `in-memory`
[`adapters`](https://docs.hyper.io/oss/building-your-own-adapter) for all of the hyper service
offerings:

- data (powered by [PouchDB](https://github.com/hyper63/hyper-adapter-pouchdb))
- cache (powered by [Sqlite](https://github.com/hyper63/hyper-adapter-sqlite))
- storage (powered by your local [file system](https://github.com/hyper63/hyper-adapter-fs))
- search (powered by [Sqlite and Minisearch](https://github.com/hyper63/hyper-adapter-minisearch))
- queue (powered by [DnDB and an in-memory queue](https://github.com/hyper63/hyper-adapter-queue))

This allows running a hyper instance locally, great for development, or for sandboxed short-lived
environments ie. GitHub Workspaces or GitPod.

> At hyper, we exclusively use short-lived ephermeral environments for all development. We dog food
> hyper to build hyper.

Then when you deploy, your application consumes your _actual_ hyper application in
[hyper cloud](https://docs.hyper.io), with no code changes required; (hyper cloud is just hyper
instances running a different `http` based api set of `adapters`)

## Documentation

[consuming hyper documentation](https://docs.hyper.io)

To use `hyper nano`, you can download a compiled binary and run it

```sh
curl https://hyperland.s3.amazonaws.com/hyper -o nano
chmod +x nano
./nano
```

There are binaries built for each major platform:

- [Linux](https://hyperland.s3.amazonaws.com/hyper)
- [Darwin (Mac)](https://hyperland.s3.amazonaws.com/hyper-x86_64-apple-darwin)
- [Darwin ARM (Mac M1)](https://hyperland.s3.amazonaws.com/hyper-aarch64-apple-darwin)
- [Windows](https://hyperland.s3.amazonaws.com/hyper-x86_64-pc-windows-msvc.exe)

### Node Usage

Alternatively, if you use `Node`, you may run `hyper nano` using `npx`:

```sh
npx hyper-nano --domain=foobar --experimental --data --cache ...
```

### Deno Usage

Alternatively, if you use `Deno` you may run `hyper nano` directly from the source:

```sh
deno run --allow-env --allow-read --allow-write=__hyper__ --allow-net --unstable --no-check=remote https://raw.githubusercontent.com/hyper63/hyper/main/images/nano/mod.js
```

If you'd like to programmatically start `hyper nano`, you can import `main.js` and run `main`:

```js
import { main } from 'https://raw.githubusercontent.com/hyper63/hyper/main/images/nano/main.js'

await main()
```

and then run:

```sh
deno run --allow-env --allow-read --allow-write=__hyper__ --allow-net --unstable --no-check=remote foo.js
```

All of these examples above will start a `hyper nano` instance, listening on port `6363`. You can
then consume your hyper instance
[`hyper-connect`](https://github.com/hyper63/hyper/tree/main/packages/connect) (recommended) or
using `HTTP`.

To consume using [`hyper-connect`](https://github.com/hyper63/hyper/tree/main/packages/connect) pass
`http://localhost:[port]/[domain]` to `hyper-connect` as your
[`connection string`](https://docs.hyper.io/app-keys#nq-connection-string)

Consume with [`hyper-connect`](https://github.com/hyper63/hyper/tree/main/packages/connect):

```js
import { connect } from 'hyper-connect'

const hyper = connect('http://localhost:6363/test')

await hyper.data.list()
```

Or consume via HTTP

```sh
curl http://localhost:6363/data/test
```

> Starting with Node 17, Node has changed how it resolves `localhost`, when using global `fetch` and
> `fetch` from libraries like `undici`. This may cause requests to `localhost` not to resolve
> correctly and fail. To get around this, you can use `127.0.0.1` or `0.0.0.0`, in lieu of
> `localhost`. For more info, See [this issue](https://github.com/nodejs/node/pull/39987)

## URL Structure Disclaimer

> If you use [`hyper-connect`](https://github.com/hyper63/hyper/tree/main/packages/connect) to
> consume hyper, you may disregard this section.

`hyper nano` is built on the open source version of hyper, and has a different URL structure than
`hyper cloud`. This is because `hyper cloud` allows for groupings of services made explicit by the
url.

For example, assuming the domain `foo` that has a `data` and `cache` service, `hyper nano` urls are
structured as `/data/foo` and `/cache/foo`, whereas `hyper cloud` urls are structured as
`/foo/data/default` and `/foo/cache/default`.

If you're consuming `hyper` using straight HTTP, you will need to take this difference in url
structure into account. If you use `hyper-connect`, no changes are required since `hyper-connect`
supports both `hyper oss` and `hyper cloud` url structures and knows which structure to use based on
the provided connection string.

### Bootstrapping services

> **This feature is experimental and will need the `--experimental` flag to be enabled**

`hyper nano` can be supplied arguments to create services on startup:

- `--data`: create a hyper data service on startup
- `--cache`: create a hyper cache service on startup
- `--storage`: createa a hyper storage service on startup

Other command line arguments can be provided:

- `--purge`: destroy the existing services. You may also pass in which service types to purge. ie
  `./nano --experimental --data --cache --storage --purge=data,cache` will delete `data` and
  `cache`, but not `storage`
- `--domain`: the name of the domain your services will be created under. This defaults to `test`

Examples:

```sh
# Listen on 6363
./nano

# Purge the existing data service, then create a new one in test domain
./nano --experimental --data --purge

# Purge the cache service, then create data and cache services in test domain
./nano --experimental --data --cache --purge=cache

# Purge data, cache, and storage, then create data, cache, and storage services in test domain
./nano --experimental --data --cache --storage --purge
```

or programmatically:

```js
import { main } from 'https://raw.githubusercontent.com/hyper63/hyper/main/images/nano/main.js'

/**
 * - Listen on 6363
 * - Purge data service in test domain
 * - Create data, cache, and storage services in the test domain
 */
await main({
  domain: 'test',
  experimental: true,
  services: {
    data: true,
    cache: true,
    storage: true,
  },
  purge: {
    data: true,
  },
})
```

## Contributing

### cache

```
./scripts/cache.sh
```

### test

```
./scripts/test.sh
```

### compile

```
./scripts/compile.sh
```

### actions

Github actions deploy hyper to https://hyperland.s3.amazonaws.com/hyper

## LICENSE

Apache 2.0
