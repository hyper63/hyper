import { assoc, compose, defaultTo, dissoc, isNil, reject } from "ramda";

import { QueryOptions } from "../types";

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
