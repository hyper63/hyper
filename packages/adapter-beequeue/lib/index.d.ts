import { Config, AdapterFn } from './types';
declare type Load<Type> = (env: Type) => Type;
declare type Link<E, F> = (env: E) => F;
declare type Plugin = {
    id: string;
    port: string;
    load: Load<Config>;
    link: Link<Config, AdapterFn>;
};
export default function (config: Config): Plugin;
export {};
