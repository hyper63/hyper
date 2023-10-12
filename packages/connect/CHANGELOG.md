# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.9.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.8.1...hyper-connect@v0.9.0) (2023-10-12)


### Features

* **connect:** add skip to QueryOptions [#609](https://github.com/hyper63/hyper/issues/609) ([fa78184](https://github.com/hyper63/hyper/commit/fa78184014a7e938d2ced2323b9179405d281933))

## [0.8.1](https://github.com/hyper63/hyper/compare/hyper-connect@v0.8.0...hyper-connect@v0.8.1) (2023-09-07)


### Features

* **connect:** add create and destroy to storage apis ([f0fd512](https://github.com/hyper63/hyper/commit/f0fd51244b96524ab47d8d3a61776145c9c0995e))
* **connect:** add optional partialFilter to data.index ([b328254](https://github.com/hyper63/hyper/commit/b328254c77ff8f582dcd8de321b90e9cba0e55f8))


### Bug Fixes

* **connect:** require confirmation on destroy apis ([05e444d](https://github.com/hyper63/hyper/commit/05e444d38d07836fb42aa20c906f0e1ea4d857e3))

## [0.8.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.7.2...hyper-connect@v0.8.0) (2023-06-01)


### Features

* **connect:** add support for sort syntax on data.index [#485](https://github.com/hyper63/hyper/issues/485) ([7abbf98](https://github.com/hyper63/hyper/commit/7abbf984455cb8e21555ec565f615238e39ead23))

## [0.7.2](https://github.com/hyper63/hyper/compare/hyper-connect@v0.7.1...hyper-connect@v0.7.2) (2023-05-24)


### Bug Fixes

* **connect:** always send useSignedUrl query param on storage.signedUrl ([ae71eae](https://github.com/hyper63/hyper/commit/ae71eaefadc85e81191f48bc26d3fe9e3dd9a1df))

### [0.7.1](https://github.com/hyper63/hyper/compare/hyper-connect@v0.7.0...hyper-connect@v0.7.1) (2023-03-18)


### Bug Fixes

* **connect:** add duplex when body is present [#1566](https://github.com/hyper63/hyper/issues/1566) ([141beec](https://github.com/hyper63/hyper/commit/141beec3862ae2a19360e776fbee56b20c3abad2))

## [0.7.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.6.2...hyper-connect@v0.7.0) (2023-03-18)


### Features

* **app-express:** add cache routes and start of tests [#559](https://github.com/hyper63/hyper/issues/559) ([89bd924](https://github.com/hyper63/hyper/commit/89bd924577dbe4f531f7bdb20544e7d2bac03734))
* **app-express:** add crawler routes and tests [#556](https://github.com/hyper63/hyper/issues/556) ([e5a9ee3](https://github.com/hyper63/hyper/commit/e5a9ee368ffbfa7c47fdbb15c55d3cf10a98dfdb))
* **app-express:** add middleware and utils [#556](https://github.com/hyper63/hyper/issues/556) ([b202ff3](https://github.com/hyper63/hyper/commit/b202ff3e9ddc2676c6a3e240717eadd75a61ea30))
* **app-express:** add queue routes and start of tests [#564](https://github.com/hyper63/hyper/issues/564) ([ba27185](https://github.com/hyper63/hyper/commit/ba27185499ac24319244a7e006547ea0e3e25e4d))
* **app-express:** add search routes and start of test [#562](https://github.com/hyper63/hyper/issues/562) ([f576fa1](https://github.com/hyper63/hyper/commit/f576fa189f9bde681cd25116f1f681b609fd5a55))
* **app-express:** data service routes and beginning tests [#556](https://github.com/hyper63/hyper/issues/556) ([5d56163](https://github.com/hyper63/hyper/commit/5d56163accc16b88cace437f29025f6eb4201976))
* **app-express:** mount util for all service routes [#556](https://github.com/hyper63/hyper/issues/556) ([e202c3b](https://github.com/hyper63/hyper/commit/e202c3b7f62b209947b022b1eca9ca217bd20295))
* **app-express:** start express driving adapter [#556](https://github.com/hyper63/hyper/issues/556) ([e135eaf](https://github.com/hyper63/hyper/commit/e135eafdb426d12e722cfcba19f30a6244a583a8))


### Bug Fixes

* **app-express:** make json middleware more flexible [#562](https://github.com/hyper63/hyper/issues/562) ([7f57d82](https://github.com/hyper63/hyper/commit/7f57d82c422eeaf76ceffbe88b93fe989051fd47))

### [0.6.2](https://github.com/hyper63/hyper/compare/hyper-connect@v0.6.1...hyper-connect@v0.6.2) (2023-02-20)

### [0.6.1](https://github.com/hyper63/hyper/compare/hyper-connect@v0.6.0...hyper-connect@v0.6.1) (2023-02-20)

### Bug Fixes

- **core:** remove backwards compatibility and passthrough for new get shape
  [#546](https://github.com/hyper63/hyper/issues/546)
  ([9b3c97e](https://github.com/hyper63/hyper/commit/9b3c97e86d5febb1fc646a9d01c7481dbdc063bb))

## [0.6.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.5.3...hyper-connect@v0.6.0) (2022-12-14)

### ⚠ BREAKING CHANGES

- **connect:** set legacyGet header to false on cache.get and data.get #531

### Features

- **connect:** set legacyGet header to false on cache.get and data.get
  [#531](https://github.com/hyper63/hyper/issues/531)
  ([b9c5bc0](https://github.com/hyper63/hyper/commit/b9c5bc08e1a866e80b988ad0279bb239b4a28de4))

### [0.5.3](https://github.com/hyper63/hyper/compare/hyper-connect@v0.5.2...hyper-connect@v0.5.3) (2022-12-14)

### Features

- **app-opine:** add legacyGet header support and refine tests
  [#531](https://github.com/hyper63/hyper/issues/531)
  ([e1d39d7](https://github.com/hyper63/hyper/commit/e1d39d70403e01659a096dfb88b70a7f22559762))
- **connect:** allow passing headers to set on request and add test coverage
  ([4843e27](https://github.com/hyper63/hyper/commit/4843e275951b40d8d8b841907fc4bc7d4246154e))
- **core:** add legacyGet flag and BL [#531](https://github.com/hyper63/hyper/issues/531)
  ([5f4ea69](https://github.com/hyper63/hyper/commit/5f4ea69cf0f0a3bdf089c91f545620f4c605f92a))

### Bug Fixes

- **connect:** set legacyGet header to true on cache.get and data.get
  [#531](https://github.com/hyper63/hyper/issues/531)
  ([31a8615](https://github.com/hyper63/hyper/commit/31a8615f577d1291fb22468cab824e8390877b88))
- **core:** remove console.log
  ([4d21b7c](https://github.com/hyper63/hyper/commit/4d21b7c5ce06d1c6ec9dfacd10fe419a5a0c13f9))

### [0.5.2](https://github.com/hyper63/hyper/compare/hyper-connect@v0.5.1...hyper-connect@v0.5.2) (2022-10-11)

### Features

- **nano:** add npx capability [#530](https://github.com/hyper63/hyper/issues/530)
  ([17de7bc](https://github.com/hyper63/hyper/commit/17de7bcaee43646bd37dfb1b2edcbbe09404e57b))

### Bug Fixes

- **connect:** make search.query options optional
  [#535](https://github.com/hyper63/hyper/issues/535)
  ([92ae9fb](https://github.com/hyper63/hyper/commit/92ae9fb594cdf61ebeb007af64edb794c364f23f))

### [0.5.1](https://github.com/hyper63/hyper/compare/hyper-connect@v0.5.0...hyper-connect@v0.5.1) (2022-08-31)

### Bug Fixes

- **connect:** add missing fetch
  ([751bd1b](https://github.com/hyper63/hyper/commit/751bd1be8e17d5e2810081b39330b2af2b835292))

## [0.5.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.4.0...hyper-connect@v0.5.0) (2022-08-31)

### ⚠ BREAKING CHANGES

- **connect:** the node version of storage.download now returns a web ReadableStream, instead of a
  Node ReadableStream. If you'd like a Node Readable stream, use the `fromWeb` provided by
  node:stream `Readable`.

See: https://undici.nodejs.org/#/?id=responsebody for an example

### Bug Fixes

- **nano:** allow write to tmp directory for hyper app file buffering
  ([be72f88](https://github.com/hyper63/hyper/commit/be72f882625200770e22f876b638182ffc923ec4))

- **connect:** use undici in lieu of node-fetch, form-data, and @web-stf/file
  ([29d366d](https://github.com/hyper63/hyper/commit/29d366d81d9637a72bde9b6bf7da6c4e47708e73))

## [0.4.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.3.0...hyper-connect@v0.4.0) (2022-08-30)

### ⚠ BREAKING CHANGES

- **connect:** removed `StorageDownloadOptions` from `storage.download`. Consumers should instead
  use `storage.signedUrl(name, { type: 'download' })

### Features

- **connect:** add signedUrl api on storage service
  [#524](https://github.com/hyper63/hyper/issues/524)
  ([7d6af43](https://github.com/hyper63/hyper/commit/7d6af43a3112fcde944c25e37ddde11265750b61))

## [0.3.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.2.2...hyper-connect@v0.3.0) (2022-08-30)

### Features

- **app-opine:** add support for useSignedUrl for getObject
  [#519](https://github.com/hyper63/hyper/issues/519)
  ([df4a63c](https://github.com/hyper63/hyper/commit/df4a63c693f894954f9315b146543a0cb074912d))
- **connect:** support useSignedUrl for storage.download
  [#522](https://github.com/hyper63/hyper/issues/522)
  ([aacb2b0](https://github.com/hyper63/hyper/commit/aacb2b0608ceb829103f7a485eeb04d49392fd73))
- **core:** add support for useSignedUrl for getObject
  [#519](https://github.com/hyper63/hyper/issues/519)
  ([4bec0c4](https://github.com/hyper63/hyper/commit/4bec0c45d36e229804201c426af85ca4816cb77e))
- **port-storage:** add support for useSignedUrl for getObject
  [#519](https://github.com/hyper63/hyper/issues/519)
  ([15f0fdf](https://github.com/hyper63/hyper/commit/15f0fdff97f1b03eb7fcaa400b818403935fc3e6))

### [0.2.2](https://github.com/hyper63/hyper/compare/hyper-connect@v0.2.1...hyper-connect@v0.2.2) (2022-08-03)

### Bug Fixes

- **connect:** remove docs from NotOkResult for data.query
  ([a2b688e](https://github.com/hyper63/hyper/commit/a2b688eb268cfe07b967f286df77bac1b5cb56e1))

### [0.2.1](https://github.com/hyper63/hyper/compare/hyper-connect@v0.2.0...hyper-connect@v0.2.1) (2022-05-23)

### Bug Fixes

- **connect:** add sideEffects: false to support treeshaking bundlers
  ([497fcc6](https://github.com/hyper63/hyper/commit/497fcc6855e1f7462832d90c6fd78c981b4c2edf))

## [0.2.0](https://github.com/hyper63/hyper/compare/hyper-connect@v0.1.20...hyper-connect@v0.2.0) (2022-05-13)

### Features

- **connect:** use deno2node in deno code to transform to node
  [#509](https://github.com/hyper63/hyper/issues/509)
  ([fbe247b](https://github.com/hyper63/hyper/commit/fbe247b2ba1c63ae23eac712a62c718a3af995c3))

### Bug Fixes

- **connect:** fix add license fields and catch promise rejection in harnesses
  [#509](https://github.com/hyper63/hyper/issues/509)
  ([5def4c3](https://github.com/hyper63/hyper/commit/5def4c37f64ba21b38cdd40af2511b004d215051))
- **connect:** swap undici for node-fetch, form-data, and @web-stf/file
  [#509](https://github.com/hyper63/hyper/issues/509)
  ([c609fc0](https://github.com/hyper63/hyper/commit/c609fc07299df71fbef452a8664c0b2244671d47)),
  closes
  [/github.com/nodejs/undici/issues/1416#issuecomment-1119548066](https://github.com/hyper63//github.com/nodejs/undici/issues/1416/issues/issuecomment-1119548066)
- **test:** make index used explicit in sort test
  ([78806a3](https://github.com/hyper63/hyper/commit/78806a3a453655e5f3422b2dccee79c152824061))
