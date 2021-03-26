/// <reference types="ts-toolbelt" />
declare function _exports(port: string): {
    id: string;
    port: string;
    load: <O2 extends object>(b: O2) => import("Object/Merge").MergeFlat<import("List/ObjectOf").ObjectOf<O2>, {
        port: string;
    }, 1, import("Misc/BuiltInObject").BuiltInObject>;
    /**
     * @param {{port: string}} env
     */
    link: (env: {
        port: string;
    }) => (a: import('@hyper63/port-queue').QueuePort) => {
        create: (args_0: {
            secret?: string | undefined;
            name: string;
            target: string;
        }) => Promise<{
            msg?: string | undefined;
            status?: number | undefined;
            ok: boolean;
        }>;
        delete: (args_0: string) => Promise<{
            msg?: string | undefined;
            status?: number | undefined;
            ok: boolean;
        }>;
        post: (args_0: {
            name: string;
            job: {};
        }) => Promise<{
            msg?: string | undefined;
            status?: number | undefined;
            ok: boolean;
        }>;
        get: (args_0: {
            name: string;
            status: "READY" | "ERROR";
        }) => Promise<{
            status?: number | undefined;
            jobs?: {}[] | undefined;
            ok: boolean;
        }>;
        retry: (args_0: {
            name: string;
            id: string;
        }) => Promise<{
            msg?: string | undefined;
            status?: number | undefined;
            ok: boolean;
        }>;
        cancel: (args_0: {
            name: string;
            id: string;
        }) => Promise<{
            msg?: string | undefined;
            status?: number | undefined;
            ok: boolean;
        }>;
    };
};
export = _exports;
