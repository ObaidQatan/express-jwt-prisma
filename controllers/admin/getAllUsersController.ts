import { NextFunction, Request, Response } from "express";
import UserModel from "../../models/User";

export default async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const user = await UserModel.getAll();

        return res.status(200).json({
            user
        });

    } catch (error: any) {
        
        if(error?.message?.indexOf("Unauthorized"))
            return res.status(401).json({
                message: error.message
            });

        res.json({
            message: error
        });
        
    }
}