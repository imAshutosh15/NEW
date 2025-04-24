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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.cacheMiddleware = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
redisClient.connect().then(() => console.log("Conected to Redis")).catch(console.error);
const cacheMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.originalUrl;
    try {
        const cacheData = yield redisClient.get(key);
        if (cacheData) {
            console.log("cache found");
            return res.status(200).json({
                "status": true,
                "data": JSON.parse(cacheData)
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        next();
    }
});
exports.cacheMiddleware = cacheMiddleware;
const setCache = (originalUrl, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.set(originalUrl, JSON.stringify(data));
});
exports.setCache = setCache;
