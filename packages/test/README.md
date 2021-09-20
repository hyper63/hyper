<h1 align="center">⚡️ hyper test suite ⚡️</h1>
<p align="center">A CLI that can run detailed tests against the hyper API</p>
<p align="center">
  <a href="https://www.repostatus.org/#active"><img src="https://www.repostatus.org/badges/latest/active.svg" alt="Project Status: Active – The project has reached a stable, usable state and is being actively developed." /></a>
</p>

---

## Table of contents

- [Usage](#usage)
- [Features](#features)
- [License](#license)

---

## Usage

```
HYPER=http://localhost:6363/test deno test --allow-net --allow-env --import-map=https://x.nest.land/hyper-test@VERSION/import_map.json https://x.nest.land/hyper-test@VERSION/mod.js
```

## Features

- Data Adapter Test Suite
- Cache Adapter Test Suite
- Search Adapter Test Suite

Coming Soon

- Storage Adapter Test Suite
- Queue Adapter Test Suite

## License

Apache 2.0 (SEE LICENSE)
