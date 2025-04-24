import express, { Router, Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";
import {z} from 'zod';
import { cacheMiddleware , setCache} from "./redis";
import { io } from "./server"; 

import { generateJsonWebToken, verifyToken } from "./jwt";
import { PrismaClient } from '../prisma/generated';
const router = Router();
const prisma = new PrismaClient();
interface CustomRequest extends Request {
    customData?: any;
}

const userSchema = z.object({
    email : z.string().email("Invalid Email"),
    password : z.string().min(3,"Password Length needed more then 3")
})

router.post("/createUser", async (req, res) => {
    
    try {
        let validatedData = userSchema.parse(req.body);
        validatedData.password = await bcrypt.hash(validatedData.password, 5)
        const user = await prisma.userDetails.create({ data: { email: validatedData.email, password: validatedData.password } });
        io.emit("user_created", user);
        res.json({
            "status": true,
            "user": user
        });
    } catch (error) {
        res.status(500).json({
            "status": false,
            "message": "Invalid User Details",
            "error" : error
        });
    }
});

router.post("/loginUser", async (req, res) => {
    const email = req.body?.email
    const password = req.body?.password
    const hashedPassword = await bcrypt.hash(password, 5)
    const userById = await prisma.userDetails.findUnique({
        where: {
            email: email
        }
    })
    const isMatch = await bcrypt.compare(password, userById?.password as string);
    if (userById && isMatch) {

        const token = generateJsonWebToken(email, hashedPassword);
        io.emit("user_loggedin", req.body);
        res.cookie('token', token, { httpOnly: true, secure: true })
        res.json({
            "status": true,
            "message": "Logged In"
        });
    } else {
        res.status(400).json({
            "status": false,
            "message": "Wrong Credentials"
        });
    }

});



router.get("/getUserDetails", verifyToken,cacheMiddleware, (req: CustomRequest, res: Response) => {
    setCache(req.originalUrl,req.customData)
    res.json({
        "status": true,
        "data": req.customData
    });
});

export default router;