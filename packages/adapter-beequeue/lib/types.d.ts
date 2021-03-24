import { z } from 'zod';
import { QueuePort } from '@hyper63/port-queue';
declare const Config: z.ZodObject<{
    redis: z.ZodString;
}, "passthrough", z.ZodTypeAny, {
    redis: string;
}, {
    redis: string;
}>;
export declare type Config = z.infer<typeof Config>;
export declare type AdapterFn = () => QueuePort | undefined;
export {};
