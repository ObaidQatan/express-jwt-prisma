import { NextFunction, Request, Response } from "express"
import verifyAccessToken from "../../utils/jwt/verifyAccessToken";

export default async (req: any, res: Response, next: NextFunction) => {

    if(!req.headers.authorization)
        next(new Error("Unauthorized: access token is required."));
    
    const token: string = req.headers.authorization.split(" ")[1];

    if(!token)
        next(new Error("Unauthorized: access token is required."));
        
    try {
        const payload = await verifyAccessToken(token);
    
        req.payload = payload;
        next();

    } catch (error) {
        next(new Error("Unauthorized")); 
    }
}
