import { Prisma, PrismaClient, User } from "@prisma/client";
import { cipher } from "../utils";
import generateAccessToken from "../utils/jwt/generateAccessToken";
import { UserLoginForm, UserRegisterForm, UserResponse } from "../types";
import UserRole from "../types/UserRole";
import UserModel from "../models/User";

let prisma = new PrismaClient();

export default class Auth{

    static async register(form: UserRegisterForm): Promise<UserResponse> {
        form.password = cipher(form.password);

        let response: UserResponse;

        const isUserExist = await UserModel.checkUserExistanceByEmail(form.email, form.role);

        if(!isUserExist)
            throw new Error(`This account has already been registered as ${form.role.toLowerCase()}`);
        
        const user = await UserModel.create(form);
        
        const accessToken = await generateAccessToken({
            id: user.id,
            email: user.email,
        }, { expiresIn: '2d'});

        await this.#updateAccessTokenIntoDB(user.accounts[0].id, accessToken, process.env.ACCESS_TOKEN_TYPE);
        
        response = {
            user:{
                id: user.id,
                email: user.email,
                emailVerified: false,
                imageUrl: user.imageUrl,
                name: user.name,
            },
            accessToken
        }

        return response;
    }


    static async login(form: UserLoginForm): Promise<UserResponse> {
        let response: UserResponse;

        
        const user = await UserModel.findUserByEmail(form.email, form.role);

        if(!user)
            throw new Error("User not found")

        const valid = cipher(form.password) === user.accounts[0].password;

        if(!valid)
            throw new Error("Password is incorrect")

        const accessToken = await generateAccessToken({
            id: user.id,
            email: user.email,
        }, { expiresIn: '2d'});

        
        await this.#updateAccessTokenIntoDB(user.accounts[0].id, accessToken, process.env.ACCESS_TOKEN_TYPE);
        
        response = {
            user:{
                id: user.id,
                email: user.email,
                emailVerified: user.emailVerified,
                imageUrl: user.imageUrl,
                name: user.name,
            },
            accessToken
        }

        return response;
    }


    static async #checkUserExistanceByEmail(email: string|undefined, role: UserRole): Promise<boolean> {
        
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

    static async #createUser(form: UserRegisterForm) : Promise<(User & { accounts: { id: string }[] })> {
       
        let userInput: Prisma.UserCreateInput = {
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

        let createdUser = await prisma.user.create({
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

    static async #updateAccessTokenIntoDB(accountID: string, accessToken: string, tokenType: string|undefined): Promise<boolean> {
        const account = await prisma.account.update({
            where:{
                id: accountID
            },

            data:{
                accessToken,
                tokenType: tokenType?tokenType:null
            }
        });

        return !!account;
    }


    static async #findUserByEmail(email: string|undefined, role: UserRole): Promise<{ id: string, name: string | null, email: string | null, emailVerified: boolean | null, imageUrl: string | null, accounts: { id: string, password: string }[] } | null> {
        
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



}
