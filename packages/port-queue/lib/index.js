"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var QueueCreateInput = zod_1.z.object({
    name: zod_1.z.string(),
    target: zod_1.z.string().url(),
    secret: zod_1.z.string().max(100).optional()
});
var QueueResponse = zod_1.z.object({
    ok: zod_1.z.boolean(),
    msg: zod_1.z.string().optional(),
    status: zod_1.z.number().optional()
});
var QueuePostInput = zod_1.z.object({
    name: zod_1.z.string(),
    job: zod_1.z.object({}).passthrough()
});
var QueueGetInput = zod_1.z.object({
    name: zod_1.z.string(),
    status: zod_1.z.enum(['READY', 'ERROR'])
});
var JobsResponse = zod_1.z.object({
    ok: zod_1.z.boolean(),
    jobs: zod_1.z.array(zod_1.z.object({}).passthrough()).optional(),
    status: zod_1.z.number().optional()
});
var JobInput = zod_1.z.object({
    name: zod_1.z.string(),
    id: zod_1.z.string()
});
var QueuePort = zod_1.z.object({
    create: zod_1.z.function()
        .args(QueueCreateInput)
        .returns(zod_1.z.promise(QueueResponse)),
    'delete': zod_1.z.function()
        .args(zod_1.z.string())
        .returns(zod_1.z.promise(QueueResponse)),
    post: zod_1.z.function()
        .args(QueuePostInput)
        .returns(zod_1.z.promise(QueueResponse)),
    get: zod_1.z.function()
        .args(QueueGetInput)
        .returns(zod_1.z.promise(JobsResponse)),
    retry: zod_1.z.function()
        .args(JobInput)
        .returns(zod_1.z.promise(QueueResponse)),
    cancel: zod_1.z.function()
        .args(JobInput)
        .returns(zod_1.z.promise(QueueResponse))
});
function default_1(adapter) {
    var instance = QueuePort.parse(adapter);
    // wrap the functions with validators
    instance.create = QueuePort.shape.create.validate(instance.create);
    instance.post = QueuePort.shape.post.validate(instance.post);
    instance.delete = QueuePort.shape.delete.validate(instance.delete);
    instance.get = QueuePort.shape.get.validate(instance.get);
    instance.retry = QueuePort.shape.retry.validate(instance.retry);
    instance.cancel = QueuePort.shape.cancel.validate(instance.cancel);
    return instance;
}
exports.default = default_1;
