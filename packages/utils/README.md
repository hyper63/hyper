<h1 align="center">⚡️ hyper-utils ⚡️</h1>
<p align="center">hyper utility functions</p>

---

## Utility Functions

- [deepSwap](#deepswap)
- [HyperErr](#hypererr)

- [Guidelines](#guidelines)

---

## deepSwap

`deepSwap` will traverse an object and replace all keys that are named `a` with the key name `b`.

### Usage

```js
import { deepSwap } from 'https://x.nest.land/hyper-utils@VERSION/deep-swap.js';

const query = {
  $or: [
    { id: '1' },
    { id: '3', type: 'cards' },
  ],
};

const newQuery = deepSwap('id', '_id', query);
// converts all keys of 'id' to keys of '_id'
```

---

## HyperErr

`HyperErr` is a function that will produce a "hyper-esque" error, that is an object containing
`{ ok: false }` and an optional `string` `msg` and optional `number` `status`:

```ts
interface HyperErr {
  ok: false;
  msg?: string;
  status?: number;
}
```

There are additional utilities `isHyperErr` and `isBaseHyperErr` which are predicate functions to
determine whether an object matches the shape of a `HyperErr`. A "base" hyper error is an object
with a single field `ok` that is equal to `false`

### Usage

```js
import {
  HyperErr,
  isBaseHyperErr,
  isHyperErr,
} from 'https://x.nest.land/hyper-utils@VERSION/hyper-err.js';

let err = HyperErr(); // { ok: false }
// or as a constructor which will set the prototype
err = new HyperErr();

// with a string
err = HyperErr('some msg'); // { ok: false, msg: "some msg" }
// or with an object
err = HyperErr({ msg: 'some msg' }); // { ok: false, msg: "some msg" }

// with a status
err = HyperErr({ status: 404 }); // { ok: false, status: 404 }

// with both msg and status
err = HyperErr({ msg: 'some msg', status: 404 }); // { ok: false, msg: "some msg", status: 404 }

isHyperErr(HyperErr()); // true
isHyperErr({ ok: false, msg: 'some msg' }); // true
isHyperErr({ msg: 'some msg' }); // false because no ok: false

isBaseHyperErr(HyperErr()); // true
isBaseHyperErr(HyperErr({ msg: 'foo' })); // false because has a msg field
```

---

## Guidelines

In order to add a function to this library, the function will need to meet the following
requirements:

1. Pure function - no side effects
2. General or Generic - re-used in at least 3 libraries or applications
3. At least 2 members of hyper must agree with the proposal to add to the utility library
