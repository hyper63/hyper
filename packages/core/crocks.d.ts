/**
 * Not Implementing all types for Crocks,
 * just what we need/use
 */

export type NullaryFunction<R> = () => R
export type UnaryFunction<Arg, R> = (arg: Arg) => R
export type VariadicFunction<Arg, R> = (...args: ReadonlyArray<Arg>) => R

/**
 * Technically Functor and Monad, but
 * I'm not going to break out Functor
 */
interface Monad<RootV> {
  map<V>(fn: UnaryFunction<RootV, V>): Monad<V>

  chain<V>(fn: UnaryFunction<RootV, Monad<V>>): Monad<V>
}

interface Sum<RootLeft, RootRight> extends Monad<RootRight> {
  bimap<Left, Right>(
    fn1: UnaryFunction<RootLeft, Left>,
    fn2: UnaryFunction<RootRight, Right>,
  ): Sum<RootLeft | Left, RootRight | Right>

  bichain<Left, Right>(
    fn1: UnaryFunction<RootLeft, Sum<Left, Right>>,
    fn2: UnaryFunction<RootRight, Sum<Left, Right>>,
  ): Sum<RootLeft | Left, RootRight | Right>
}

export function Identity<V>(v: V): Identity<V>

export class Identity<RootV> implements Monad<RootV> {
  map<V>(fn: UnaryFunction<RootV, V>): Identity<V>

  chain<V>(fn: UnaryFunction<RootV, Identity<V>>): Identity<V>

  valueOf(): RootV
}

export function Async<Left, Right>(
  fn: (
    reject: UnaryFunction<Left, void>,
    resolve: UnaryFunction<Right, void>,
  ) => unknown,
): Async<Left, Right>

export class Async<RootLeft, RootRight> implements Sum<RootLeft, RootRight> {
  map<Right>(fn: UnaryFunction<RootRight, Right>): Async<RootLeft, Right>

  bimap<Left, Right>(
    fn1: UnaryFunction<RootLeft, Left>,
    fn2: UnaryFunction<RootRight, Right>,
  ): Async<RootLeft | Left, RootRight | Right>

  chain<Left, Right>(
    fn: UnaryFunction<RootRight, Async<Left, Right>>,
  ): Async<Left, Right>

  bichain<Left, Right>(
    fn1: UnaryFunction<RootLeft, Async<Left, Right>>,
    fn2: UnaryFunction<RootRight, Async<Left, Right>>,
  ): Async<RootLeft | Left, RootRight | Right>

  fork(
    reject: UnaryFunction<RootLeft, unknown>,
    resolve: UnaryFunction<RootRight, unknown>,
    cancel?: NullaryFunction<void>,
  ): void

  toPromise(): Promise<RootLeft>

  static fromPromise<V, R, L>(
    fn: VariadicFunction<V, Promise<R>>,
  ): VariadicFunction<V, Async<L, R>>
  static of<V>(val: V): Async<void, V>
  static Rejected<V>(val: V): Async<V, void>
  static Resolved<V>(val: V): Async<void, V>
}

/**
 * Just implementating ReaderT for Async
 * since that's all we use it for
 */
export function ReaderT<A extends Async<L, R>, L, R>(
  monad: new () => A,
): AsyncReader<unknown>

export class AsyncReader<RootV> implements Monad<RootV> {
  map<V>(fn: UnaryFunction<RootV, V>): AsyncReader<V>

  chain<V>(fn: UnaryFunction<RootV, AsyncReader<V>>): AsyncReader<V>

  of<V>(v: V): AsyncReader<V>

  runWith<E, L = unknown>(env: E): Async<L, RootV>
  /**
   * The function passed to ask() should return an Async,
   *
   * But the Async is not folded into the ReaderT itself.
   * To do that, we must call lift().
   *
   * This would be similar to having a Promise<Promise<...>>
   * and having to call p.then(innerp => innerp.then(...)),
   *
   * However, that is not possible with Promises
   * because they implicitly flatten,
   * whereas a ReaderT created via ask() does not.
   */
  ask<E, V, L = unknown>(
    fn: UnaryFunction<E, Async<L, V>>,
  ): AsyncReader<Async<L, V>>
  lift<V, L = unknown>(a: Async<L, V>): AsyncReader<V>
}

export class Either<RootLeft, RootRight> implements Sum<RootLeft, RootRight> {
  map<Right>(fn: UnaryFunction<RootRight, Right>): Either<RootLeft, Right>

  bimap<Left, Right>(
    fn1: UnaryFunction<RootLeft, Left>,
    fn2: UnaryFunction<RootRight, Right>,
  ): Either<RootLeft | Left, RootRight | Right>

  chain<Left, Right>(
    fn: UnaryFunction<RootRight, Async<Left, Right>>,
  ): Either<Left, Right>

  bichain<Left, Right>(
    fn1: UnaryFunction<RootLeft, Either<Left, Right>>,
    fn2: UnaryFunction<RootRight, Either<Left, Right>>,
  ): Either<RootLeft | Left, RootRight | Right>

  static Left<V>(val: V): Either<V, void>
  static Right<V>(val: V): Either<void, V>
}

export function eitherToAsync<L, R>(either: Either<L, R>): Async<L, R>

/**
 * Keeping this simple for now
 */
export function compose<A, R>(
  ...fns: ((a: unknown) => unknown)[]
): (arg: A) => R
