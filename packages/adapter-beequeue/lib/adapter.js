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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var bee_queue_1 = __importDefault(require("bee-queue"));
function default_1(env) {
    var _this = this;
    var queues = {};
    return {
        index: function () { return Promise.resolve(Object.keys(queues)); },
        create: function (_a) {
            var name = _a.name, target = _a.target, secret = _a.secret;
            var q = new bee_queue_1.default(name, { redis: env.redis });
            q.on('succeeded', function (job, result) {
                console.log("Job " + job.id + " succeeded with result: " + JSON.stringify(result));
            });
            q.on('failed', function (job, err) {
                console.log("Job " + job.id + " failed with error " + err.message);
            });
            q.process(function (job) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch(target, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(job.data)
                            })
                                .then(function (res) {
                                if (res.status > 300) {
                                    throw new Error('Job Failed');
                                }
                                return res.json();
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); });
            queues[name] = q;
            return Promise.resolve({ ok: true });
        },
        post: function (input) {
            var q = queues[input.name];
            var job = q.createJob(input.job);
            job.save();
            return Promise.resolve({ ok: true });
        },
        'delete': function (name) {
            var q = queues[name];
            queues = ramda_1.omit([name], queues);
            return q.destroy().then(function () { return ({ ok: true }); });
        },
        get: function (input) {
            return queues[input.name].getJobs(input.status === 'READY' ? 'waiting' : 'failed', { start: 0, end: 25 })
                .then(function (jobs) { return ({ ok: true, jobs: jobs }); });
        },
        cancel: function (input) {
            var q = queues[input.name];
            return q.removeJob(input.id).then(function () { return ({ ok: true }); });
        },
        retry: function (input) {
            var q = queues[input.name];
            return Promise.resolve({ ok: true });
        }
    };
}
exports.default = default_1;
