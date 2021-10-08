<h1 align="center">⚡️ hyper-utils ⚡️</h1>
<p align="center">hyper utillity functions</p>

---

## Utility Functions

- [deepSwap](#deepswap)

- [Guidelines](#guidelines)

---

## deepSwap

`deepSwap` will traverse an object and replace all keys that are named `a` with
the key name `b`.

### Usage

```js
import { deepSwap } from "https://x.nest.land/hyper-utils@VERSION/deep-swap.js";

const query = {
  $or: [
    { id: "1" },
    { id: "3", type: "cards" },
  ],
};

const newQuery = deepSwap("id", "_id", query);
// converts all keys of 'id' to keys of '_id'
```

---

## Guidelines

In order to add a function to this library, the function will need to meet the
following requirements:

1. Pure function - no side effects
2. General or Generic - re-used in at least 3 libraries or applications
3. At least 2 members of hyper must agree with the proposal to add to the
   utility library
