
import { merge } from 'ramda'
import { Config, AdapterFn } from './types'
import adapter from './adapter'
import fetch from 'node-fetch'

/* @ts-ignore */
globalThis.fetch = fetch

type Load<Type> = (env: Type) => Type
type Link<E, F> = (env: E) => F

type Plugin = {
  id: string;
  port: string;
  load: Load<Config>;
  link: Link<Config, AdapterFn>;
}

export default function (config: Config) : Plugin {
  const load : Load<Config> = function (env:Config) : Config {
    return merge(env, config)
  }

  const link : Link<Config, AdapterFn> = function (env: Config) : AdapterFn {
    return () => adapter(env)
  }

  return ({
    id: 'beequeue',
    port: 'queue',
    load,
    link
  })
}
