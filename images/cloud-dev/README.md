<h1 align="center">hyper cloud dev image</h1>

A development instance of hyper cloud core service, this can be used to create a
frictionless dev experience for hyper-cloud.

---

## Table of Contents

- [cache](#cache)
- [test](#test)
- [compile](#compile)
- [upload](#upload)

---

## cache

```
./scripts/cache.sh
```

## test

```
./scripts/test.sh
```

## compile

```
./scripts/compile.sh
```

## upload

```
aws s3 cp --acl public-read ./hyper-cloud-dev s3://hyperland
```
