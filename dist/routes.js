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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const redis_1 = require("./redis");
const jwt_1 = require("./jwt");
const generated_1 = require("../prisma/generated");
const router = (0, express_1.Router)();
const prisma = new generated_1.PrismaClient();
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid Email"),
    password: zod_1.z.string().min(3, "Password Length needed more then 3")
});
router.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let validatedData = userSchema.parse(req.body);
        validatedData.password = yield bcrypt_1.default.hash(validatedData.password, 5);
        const user = yield prisma.userDetails.create({ data: { email: validatedData.email, password: validatedData.password } });
        res.json({
            "status": true,
            "user": user
        });
    }
    catch (error) {
        res.status(500).json({
            "status": false,
            "message": "Invalid User Details",
            "error": error
        });
    }
}));
router.post("/loginUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const email = (_a = req.body) === null || _a === void 0 ? void 0 : _a.email;
    const password = (_b = req.body) === null || _b === void 0 ? void 0 : _b.password;
    const hashedPassword = yield bcrypt_1.default.hash(password, 5);
    const userById = yield prisma.userDetails.findUnique({
        where: {
            email: email
        }
    });
    const isMatch = yield bcrypt_1.default.compare(password, userById === null || userById === void 0 ? void 0 : userById.password);
    if (userById && isMatch) {
        const token = (0, jwt_1.generateJsonWebToken)(email, hashedPassword);
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.json({
            "status": true,
            "message": "Logged In"
        });
    }
    else {
        res.status(400).json({
            "status": false,
            "message": "Wrong Credentials"
        });
    }
}));
router.get("/getUserDetails", jwt_1.verifyToken, redis_1.cacheMiddleware, (req, res) => {
    (0, redis_1.setCache)(req.originalUrl, req.customData);
    res.json({
        "status": true,
        "data": req.customData
    });
});
exports.default = router;
