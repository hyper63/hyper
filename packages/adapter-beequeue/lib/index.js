"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var adapter_1 = __importDefault(require("./adapter"));
var node_fetch_1 = __importDefault(require("node-fetch"));
/* @ts-ignore */
globalThis.fetch = node_fetch_1.default;
function default_1(config) {
    var load = function (env) {
        return ramda_1.merge(env, config);
    };
    var link = function (env) {
        return function () { return adapter_1.default(env); };
    };
    return ({
        id: 'beequeue',
        port: 'queue',
        load: load,
        link: link
    });
}
exports.default = default_1;
