# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.5.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.4.0...hyper-connect@v0.5.0) (2022-08-31)


### ⚠ BREAKING CHANGES

* **connect:** the node version of storage.download now returns a web ReadableStream,
instead of a Node ReadableStream. If you'd like a Node Readable stream, use the `fromWeb`
provided by node:stream `Readable`.

See: https://undici.nodejs.org/#/?id=responsebody for an example

### Bug Fixes

* **nano:** allow write to tmp directory for hyper app file buffering ([be72f88](https://github.com/hyper63/hyper/commit/be72f882625200770e22f876b638182ffc923ec4))


* **connect:** use undici in lieu of node-fetch, form-data, and @web-stf/file ([29d366d](https://github.com/hyper63/hyper/commit/29d366d81d9637a72bde9b6bf7da6c4e47708e73))

## [0.4.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.3.0...hyper-connect@v0.4.0) (2022-08-30)


### ⚠ BREAKING CHANGES

* **connect:** removed `StorageDownloadOptions` from `storage.download`.
Consumers should instead use `storage.signedUrl(name, { type: 'download' })

### Features

* **connect:** add signedUrl api on storage service [#524](https://github.com/hyper63/hyper/issues/524) ([7d6af43](https://github.com/hyper63/hyper/commit/7d6af43a3112fcde944c25e37ddde11265750b61))

## [0.3.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.2.2...hyper-connect@v0.3.0) (2022-08-30)


### Features

* **app-opine:** add support for useSignedUrl for getObject [#519](https://github.com/hyper63/hyper/issues/519) ([df4a63c](https://github.com/hyper63/hyper/commit/df4a63c693f894954f9315b146543a0cb074912d))
* **connect:** support useSignedUrl for storage.download [#522](https://github.com/hyper63/hyper/issues/522) ([aacb2b0](https://github.com/hyper63/hyper/commit/aacb2b0608ceb829103f7a485eeb04d49392fd73))
* **core:** add support for useSignedUrl for getObject [#519](https://github.com/hyper63/hyper/issues/519) ([4bec0c4](https://github.com/hyper63/hyper/commit/4bec0c45d36e229804201c426af85ca4816cb77e))
* **port-storage:** add support for useSignedUrl for getObject [#519](https://github.com/hyper63/hyper/issues/519) ([15f0fdf](https://github.com/hyper63/hyper/commit/15f0fdff97f1b03eb7fcaa400b818403935fc3e6))

### [0.2.2](https://github.com/hyper63/hyper/compare/hyper-connect@v0.2.1...hyper-connect@v0.2.2) (2022-08-03)


### Bug Fixes

* **connect:** remove docs from NotOkResult for data.query ([a2b688e](https://github.com/hyper63/hyper/commit/a2b688eb268cfe07b967f286df77bac1b5cb56e1))

### [0.2.1](https://github.com/hyper63/hyper/compare/hyper-connect@v0.2.0...hyper-connect@v0.2.1) (2022-05-23)


### Bug Fixes

* **connect:** add sideEffects: false to support treeshaking bundlers ([497fcc6](https://github.com/hyper63/hyper/commit/497fcc6855e1f7462832d90c6fd78c981b4c2edf))

## [0.2.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.1.20...hyper-connect@v0.2.0) (2022-05-13)


### Features

* **connect:** use deno2node in deno code to transform to node [#509](https://github.com/hyper63/hyper/issues/509) ([fbe247b](https://github.com/hyper63/hyper/commit/fbe247b2ba1c63ae23eac712a62c718a3af995c3))


### Bug Fixes

* **connect:** fix add license fields and catch promise rejection in harnesses [#509](https://github.com/hyper63/hyper/issues/509) ([5def4c3](https://github.com/hyper63/hyper/commit/5def4c37f64ba21b38cdd40af2511b004d215051))
* **connect:** swap undici for node-fetch, form-data, and @web-stf/file [#509](https://github.com/hyper63/hyper/issues/509) ([c609fc0](https://github.com/hyper63/hyper/commit/c609fc07299df71fbef452a8664c0b2244671d47)), closes [/github.com/nodejs/undici/issues/1416#issuecomment-1119548066](https://github.com/hyper63//github.com/nodejs/undici/issues/1416/issues/issuecomment-1119548066)
* **test:** make index used explicit in sort test ([78806a3](https://github.com/hyper63/hyper/commit/78806a3a453655e5f3422b2dccee79c152824061))
