import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    customData?: any;
}

// Extend Request interface to include userDetails
const generateJsonWebToken = (email: string, password: string): string => {
    return jwt.sign({ email: email, password : password }, "secret", {});
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): any => {
    if (!req.cookies.token) {
        return res.status(401).json({ "status": false, message: "UNAUTHORIZED" });
    } else {
        try {
            req.customData = jwt.verify(req.cookies.token, "secret");
            next(); // Pass control to the route handler
        } catch (error) {
            return res.status(403).json({ "status": false, message: "Invalid Token Provided" });
        }
    }
}
export { generateJsonWebToken, verifyToken }