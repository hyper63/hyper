"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var Config = zod_1.z.object({
    redis: zod_1.z.string().url()
}).passthrough();
