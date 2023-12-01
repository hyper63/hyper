<p align="center">
  <a href="https://www.hyper.io">
    <img alt="Hyper" src="hyper63-logo.png" width="60" />
  </a>
</p>

<h1 align="center">
  hyper
</h1>

<p align="center">
  Use Clean Cloud Architecture to Scale on your Terms
</p>

<p align="center">
  <a href="https://docs.hyper.io/">Docs</a>
  <span> · </span>
  <a href="https://github.com/hyper63/hyper/issues">Issues</a>
  <span> · </span>
  <a href="https://docs.hyper.io/whats-new">What's New</a>
</p>

<!-- toc -->

- [Introduction](#introduction)
- [Status](#status)
- [Running Locally](#running-locally)
- [Documentation](#documentation)
- [Contributions](#contributions)
- [Developer Setup](#developer-setup)
- [Thank you](#thank-you)

<!-- tocstop -->

## Introduction

👋 Hey 👋

Welcome to the hyper Service Framework project ⚡️!

Hyper is a multi-cloud, multi-language, service framework that enables best-of-breed cloud service
utilization, from any cloud provider. By providing a simple and extensible context-bound API for the
Cloud, the hyper Service Framework decouples application services from the infrastructure that
powers them, positioning application software for growth and long term stability.

As a result, the hyper Service Framework helps software organizations build "optimally-scaled"
software and software teams.

Hyper organizations tame `technical debt`, by using
[Clean Cloud Architecture](https://blog.hyper.io/clean-architecture-at-hyper/) to sensibly scale
their software and software teams, only when the complexity is needed, and not all up-front.

## Status

- [x] Development
- [x] Alpha
- [x] Beta
- [ ] v1.0

## Running Locally

You can run a hyper server locally, with 5 locally running hyper services, using
[`hyper-nano`](./images/nano), a precompiled executable binary of the hyper service framework.

```sh
curl https://hyperland.s3.amazonaws.com/hyper -o hyper-nano
chmod +x hyper-nano
./hyper-nano
```

Alternatively, if you're using `node`, you can run `npx hyper-nano`

> This command will run a hyper server on PORT `6363` and store data for each hyper service in a
> directory named `__hyper__` placed in the `cwd` [Ctrl/Cmd] - C will stop the service.

This `nano` version of hyper implements the following ports and adapters:

- `data` (powered by [In-Memory MongoDB](https://github.com/hyper63/hyper-adapter-mongodb))
- `cache` (powered by [Sqlite](https://github.com/hyper63/hyper-adapter-sqlite))
- `storage` (powered by your local [file system](https://github.com/hyper63/hyper-adapter-fs))
- `search` (powered by [Sqlite and Minisearch](https://github.com/hyper63/hyper-adapter-minisearch))
- `queue` (powered by
  [Sqlite and an in-memory queue](https://github.com/hyper63/hyper-adapter-queue))

Learn more about [`hyper-nano`](./images/nano) and read our
[blog post](https://blog.hyper.io/introducing-hyper-nano-hyper-cloud-in-a-bottle/)

## Documentation

For more information about hyper63 go to our documentation site. https://docs.hyper.io if you are
unable to find the information you are looking for, post a question in our
[slack](https://hyper.io/slack)

## Contributions

See **[Contributing to hyper](https://docs.hyper.io/oss/contributing-to-hyper)**.

## Developer Setup

Fork this repo and use gitpod!

[Gitpod](https://gitpod.io)

## Thank you

- OpenSource Community
- CharlestonJS Community
- JRS Coding School Team
- And everyone else that has helped this project become successful!
