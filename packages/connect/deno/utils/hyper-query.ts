import { R } from "../deps.ts";

import { QueryOptions } from "../types.ts";

const { assoc, compose, defaultTo, dissoc, isNil, reject } = R;

const swap = (old: string, cur: string) =>
  compose(
    dissoc(old),
    (o: Record<string, unknown>) => assoc(cur, o[old], o),
  );

export const toDataQuery = (selector: unknown, options?: QueryOptions) =>
  compose(
    reject(isNil),
    swap("useIndex", "use_index"),
    assoc("selector", selector),
    defaultTo({}),
  )(options);
