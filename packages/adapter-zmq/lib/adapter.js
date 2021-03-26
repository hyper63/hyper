"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var omit = require('ramda').omit;
var zmq = require('zeromq');
var noop = function () { return Promise.resolve({ ok: false, msg: 'Not Implemented' }); };
/**
 * @func
 * creates adapter for queue port
 *
 * @param {{port: string}} env
 * @returns {Promise<import('@hyper63/port-queue').QueuePort>}
 */
module.exports = function (env) {
    return __awaiter(this, void 0, void 0, function () {
        var queues, send;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queues = {};
                    // setup worker
                    worker(env.port);
                    return [4 /*yield*/, producer(env.port)];
                case 1:
                    send = _a.sent();
                    return [2 /*return*/, {
                            /**
                             * @param {import('@hyper63/port-queue').QueueCreateInput} input
                             */
                            create: function (input) {
                                queues[input.name] = input;
                                return Promise.resolve({ ok: true });
                            },
                            /**
                             * @param {string} name
                             */
                            'delete': function (name) {
                                queues = omit([name], queues);
                                return Promise.resolve({ ok: true });
                            },
                            /**
                             * @param {import('@hyper63/port-queue').QueuePostInput} input
                             */
                            post: function (input) { return __awaiter(_this, void 0, void 0, function () {
                                var q;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            q = queues[input.name];
                                            // @ts-ignore
                                            return [4 /*yield*/, send(q.target, input.job)];
                                        case 1:
                                            // @ts-ignore
                                            _a.sent();
                                            return [2 /*return*/, Promise.resolve({ ok: true })];
                                    }
                                });
                            }); },
                            get: noop,
                            cancel: noop,
                            retry: noop
                        }];
            }
        });
    });
};
/**
 * @param {string} port
 */
function worker(port) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var sock, sock_1, sock_1_1, msg, job, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sock = new zmq.Pull;
                    sock.connect("tcp://127.0.0.1:" + port);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 13]);
                    sock_1 = __asyncValues(sock);
                    _b.label = 2;
                case 2: return [4 /*yield*/, sock_1.next()];
                case 3:
                    if (!(sock_1_1 = _b.sent(), !sock_1_1.done)) return [3 /*break*/, 6];
                    msg = sock_1_1.value[0];
                    job = JSON.parse(msg.toString());
                    return [4 /*yield*/, fetch(job.target, { method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(job.data)
                        }).then(function (res) { return res.json(); })
                            .then(function (res) { return console.log(JSON.stringify(res)); })
                            .catch(function (err) { return console.log(err.message); })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _b.trys.push([8, , 11, 12]);
                    if (!(sock_1_1 && !sock_1_1.done && (_a = sock_1.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _a.call(sock_1)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
/**
 * @param {string} port
 */
function producer(port) {
    return __awaiter(this, void 0, void 0, function () {
        var sock, send;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sock = new zmq.Push;
                    return [4 /*yield*/, sock.bind("tcp://127.0.0.1:" + port)
                        /**
                         * @param {string} target
                         * @param {{[key: string]: any}} job
                         */
                    ];
                case 1:
                    _a.sent();
                    send = function (target, job) { return sock.send(JSON.stringify({ target: target, data: job })).then(function () { return ({ ok: true }); }); };
                    return [2 /*return*/, send];
            }
        });
    });
}
