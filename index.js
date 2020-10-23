"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.makeJackall = exports.jackall = exports.JACKALL_ERROR_CODE = void 0;
exports.JACKALL_ERROR_CODE = {
    NOMATCH_VERSION: "Version don't match.",
    FAILED_ASYNCTASK: "Failed to async task."
};
var Jackall = /** @class */ (function () {
    function Jackall() {
        this.resources = {};
    }
    Jackall.prototype.acquire = function (key, d) {
        return __awaiter(this, void 0, void 0, function () {
            var version, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = this.increment(key);
                        return [4 /*yield*/, this.wait(d)];
                    case 1:
                        res = _a.sent();
                        this.kill(key);
                        if (version !== this.getVersion(key)) {
                            return [2 /*return*/, {
                                    ok: false,
                                    code: exports.JACKALL_ERROR_CODE.NOMATCH_VERSION,
                                    value: new Error("Jackall Error: " + exports.JACKALL_ERROR_CODE.NOMATCH_VERSION)
                                }];
                        }
                        if (!res.ok) {
                            return [2 /*return*/, {
                                    ok: false,
                                    code: exports.JACKALL_ERROR_CODE.FAILED_ASYNCTASK,
                                    value: res.value
                                }];
                        }
                        return [2 /*return*/, {
                                ok: true,
                                value: res.value
                            }];
                }
            });
        });
    };
    Jackall.prototype.wait = function (d) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = {
                            ok: true
                        };
                        return [4 /*yield*/, d];
                    case 1: return [2 /*return*/, (_a.value = _b.sent(),
                            _a)];
                    case 2:
                        e_1 = _b.sent();
                        return [2 /*return*/, {
                                ok: false,
                                value: e_1
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Jackall.prototype.getVersion = function (key) {
        var res = this.resources[key];
        return (res === null || res === void 0 ? void 0 : res.version) || 0;
    };
    Jackall.prototype.increment = function (key) {
        var version = this.getVersion(key) + 1;
        this.resources[key] = {
            version: version,
            living: true
        };
        return version;
    };
    Jackall.prototype.kill = function (key) {
        var res = this.resources[key];
        this.resources[key] = __assign(__assign({}, res), { living: false });
    };
    return Jackall;
}());
exports.jackall = new Jackall();
exports.makeJackall = function () { return new Jackall(); };
