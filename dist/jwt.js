"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateJsonWebToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Extend Request interface to include userDetails
const generateJsonWebToken = (email, password) => {
    return jsonwebtoken_1.default.sign({ email: email, password: password }, "secret", {});
};
exports.generateJsonWebToken = generateJsonWebToken;
const verifyToken = (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({ "status": false, message: "UNAUTHORIZED" });
    }
    else {
        try {
            req.customData = jsonwebtoken_1.default.verify(req.cookies.token, "secret");
            next(); // Pass control to the route handler
        }
        catch (error) {
            return res.status(403).json({ "status": false, message: "Invalid Token Provided" });
        }
    }
};
exports.verifyToken = verifyToken;
