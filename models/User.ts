import { Prisma, User } from "@prisma/client";
import prisma from '../services/PrismaConnector';
import { UserRegisterForm } from "../types";
import UserRole from "../types/UserRole";

export default class UserModel {

    static async create(form: UserRegisterForm): Promise<User & { accounts: { id: string }[] }> {
        const userInput: Prisma.UserCreateInput = {
            email: form.email,
            emailVerified: false,
            imageUrl: form.imageUrl,
            name: form.name,
            accounts: {
                create: [
                    {   
                        password: form.password,
                        provider: form.provider,
                        providerAccountId: form.providerId,
                        role: form.role,
                        scope: {
                            create: {
                                read: true
                            }
                        }
                    }
                ]
            }
        }

        const createdUser = await prisma.user.create({
            data: userInput,
            
            include:{
                accounts:{
                    where:{
                        role: form.role
                    },

                    select:{
                        id: true,
                    }
                },
            }
        });

        return createdUser;
    }


    static async updateByEmail(email: string, form: any) {

        const updatedUser = await prisma.user.update({
            where: {
                email
            },

            data: form
        });

        return updatedUser;
    }


    static async updateById(id: string, form: any) {

        const updatedUser = await prisma.user.update({
            where: {
                id
            },

            data: form
        });

        if(!updatedUser)
            return null;

        return updatedUser;
    }




    static async checkUserExistanceByEmail(email: string|undefined, role: UserRole): Promise<boolean> {
        
        const count = await prisma.user.count({
            where:{
                AND:[
                    {
                        email
                    },

                    {
                        accounts:{
                            some:{
                                role
                            }
                        }
                    }
                ]
            }
        })

        return count > 0;
    }


    static async findUserByEmail(email: string|undefined, role: UserRole): Promise<{ id: string, name: string | null, email: string | null, emailVerified: boolean | null, imageUrl: string | null, accounts: { id: string, password: string }[] } | null> {
        
        const user = await prisma.user.findUnique({
            where:{
             email
            },

            select:{
                id: true,
                email: true,
                emailVerified: true,
                imageUrl: true,
                name: true,

                accounts:{
                    where:{
                        role
                    },

                    select:{
                        id: true,
                        password: true
                    }
                }
            }
        });

        return user;
    }



    
    static async getAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
         if(!users?.length)
            return [];

        return users;
    }


    static async deleteByEmail(email: string): Promise<boolean> {
        const deleted = await prisma.user.delete({
            where: {
                email
            }
        });

        if(deleted)
            return true;

        return false;
    }


    static async deleteAll(): Promise<boolean> {
        const deleted = await prisma.user.deleteMany();

        if(deleted)
            return true;

        return false;
    }





    static async accounts(email: string){
        const user = await prisma.user.findUnique({
            where: {
                email
            },

            select: {
                accounts: true
            }
        });

        if(!user)
            throw new Error("User not found.");
        
        if(!user.accounts?.length)
            return [];

        return user.accounts;
    }




}