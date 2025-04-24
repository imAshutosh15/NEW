import { json } from 'body-parser';
import express, { Router, Request, Response, NextFunction } from 'express';
import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect().then(()=> console.log("Conected to Redis")).catch(console.error);

const cacheMiddleware = async (req: Request,res: Response, next: NextFunction):Promise<any> => {
    const key = req.originalUrl;
    try {
        const cacheData = await redisClient.get(key);
        if(cacheData){
            console.log("cache found");
            return res.status(200).json({
                "status": true,
                "data": JSON.parse(cacheData)
            });
        }
        next();
    } catch (error) {
        console.log(error);
        next();
    }
    
}

const setCache = async(originalUrl: string, data : any)=>{
    await redisClient.set(originalUrl,JSON.stringify(data))
}

export {cacheMiddleware, setCache}
