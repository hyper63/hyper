import { z } from 'zod';
declare const QueueCreateInput: z.ZodObject<{
    name: z.ZodString;
    target: z.ZodString;
    secret: z.ZodOptional<z.ZodString, false>;
}, "strip", z.ZodTypeAny, {
    secret?: string | undefined;
    name: string;
    target: string;
}, {
    secret?: string | undefined;
    name: string;
    target: string;
}>;
declare const QueueResponse: z.ZodObject<{
    ok: z.ZodBoolean;
    msg: z.ZodOptional<z.ZodString, false>;
    status: z.ZodOptional<z.ZodNumber, false>;
}, "strip", z.ZodTypeAny, {
    msg?: string | undefined;
    status?: number | undefined;
    ok: boolean;
}, {
    msg?: string | undefined;
    status?: number | undefined;
    ok: boolean;
}>;
declare const QueuePostInput: z.ZodObject<{
    name: z.ZodString;
    job: z.ZodObject<{}, "passthrough", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    name: string;
    job: {};
}, {
    name: string;
    job: {};
}>;
declare const QueueGetInput: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodEnum<["READY", "ERROR"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "READY" | "ERROR";
}, {
    name: string;
    status: "READY" | "ERROR";
}>;
declare const JobsResponse: z.ZodObject<{
    ok: z.ZodBoolean;
    jobs: z.ZodOptional<z.ZodArray<z.ZodObject<{}, "passthrough", z.ZodTypeAny, {}, {}>>, false>;
    status: z.ZodOptional<z.ZodNumber, false>;
}, "strip", z.ZodTypeAny, {
    status?: number | undefined;
    jobs?: {}[] | undefined;
    ok: boolean;
}, {
    status?: number | undefined;
    jobs?: {}[] | undefined;
    ok: boolean;
}>;
declare const JobInput: z.ZodObject<{
    name: z.ZodString;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
declare const QueuePort: z.ZodObject<{
    create: z.ZodFunction<z.ZodTuple<[z.ZodObject<{
        name: z.ZodString;
        target: z.ZodString;
        secret: z.ZodOptional<z.ZodString, false>;
    }, "strip", z.ZodTypeAny, {
        secret?: string | undefined;
        name: string;
        target: string;
    }, {
        secret?: string | undefined;
        name: string;
        target: string;
    }>]>, z.ZodPromise<z.ZodObject<{
        ok: z.ZodBoolean;
        msg: z.ZodOptional<z.ZodString, false>;
        status: z.ZodOptional<z.ZodNumber, false>;
    }, "strip", z.ZodTypeAny, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }>>>;
    delete: z.ZodFunction<z.ZodTuple<[z.ZodString]>, z.ZodPromise<z.ZodObject<{
        ok: z.ZodBoolean;
        msg: z.ZodOptional<z.ZodString, false>;
        status: z.ZodOptional<z.ZodNumber, false>;
    }, "strip", z.ZodTypeAny, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }>>>;
    post: z.ZodFunction<z.ZodTuple<[z.ZodObject<{
        name: z.ZodString;
        job: z.ZodObject<{}, "passthrough", z.ZodTypeAny, {}, {}>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        job: {};
    }, {
        name: string;
        job: {};
    }>]>, z.ZodPromise<z.ZodObject<{
        ok: z.ZodBoolean;
        msg: z.ZodOptional<z.ZodString, false>;
        status: z.ZodOptional<z.ZodNumber, false>;
    }, "strip", z.ZodTypeAny, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }>>>;
    get: z.ZodFunction<z.ZodTuple<[z.ZodObject<{
        name: z.ZodString;
        status: z.ZodEnum<["READY", "ERROR"]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "READY" | "ERROR";
    }, {
        name: string;
        status: "READY" | "ERROR";
    }>]>, z.ZodPromise<z.ZodObject<{
        ok: z.ZodBoolean;
        jobs: z.ZodOptional<z.ZodArray<z.ZodObject<{}, "passthrough", z.ZodTypeAny, {}, {}>>, false>;
        status: z.ZodOptional<z.ZodNumber, false>;
    }, "strip", z.ZodTypeAny, {
        status?: number | undefined;
        jobs?: {}[] | undefined;
        ok: boolean;
    }, {
        status?: number | undefined;
        jobs?: {}[] | undefined;
        ok: boolean;
    }>>>;
    retry: z.ZodFunction<z.ZodTuple<[z.ZodObject<{
        name: z.ZodString;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>]>, z.ZodPromise<z.ZodObject<{
        ok: z.ZodBoolean;
        msg: z.ZodOptional<z.ZodString, false>;
        status: z.ZodOptional<z.ZodNumber, false>;
    }, "strip", z.ZodTypeAny, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }>>>;
    cancel: z.ZodFunction<z.ZodTuple<[z.ZodObject<{
        name: z.ZodString;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>]>, z.ZodPromise<z.ZodObject<{
        ok: z.ZodBoolean;
        msg: z.ZodOptional<z.ZodString, false>;
        status: z.ZodOptional<z.ZodNumber, false>;
    }, "strip", z.ZodTypeAny, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }, {
        msg?: string | undefined;
        status?: number | undefined;
        ok: boolean;
    }>>>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export declare type QueuePort = z.infer<typeof QueuePort>;
export declare type QueueCreateInput = z.infer<typeof QueueCreateInput>;
export declare type QueueResponse = z.infer<typeof QueueResponse>;
export declare type QueuePostInput = z.infer<typeof QueuePostInput>;
export declare type QueueGetInput = z.infer<typeof QueueGetInput>;
export declare type JobsResponse = z.infer<typeof JobsResponse>;
export declare type JobInput = z.infer<typeof JobInput>;
export default function (adapter: QueuePort): QueuePort;
export {};
