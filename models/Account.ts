import AccountUpdateForm from "../types/AccountUpdateForm";

export default class Account {

    static async updateById(id: string, form: AccountUpdateForm){
        const updatedAccount = await prisma.account.update({
            where: {
                id
            },

            data: form
        });

        if(!updatedAccount)
            return null;

        return updatedAccount;
    }


    static async deleteById(id: string){
        const deleted = await prisma.account.delete({
            where: {
                id
            }
        });

        if(deleted)
            return true;
        
        return false;
    }


    static async getAll() {
        const accounts = await prisma.account.findMany();
         if(!accounts?.length)
            return [];

        return accounts;
    }


    static async deleteAll(): Promise<boolean> {
        const deleted = await prisma.account.deleteMany();

        if(deleted)
            return true;

        return false;
    }





    static async user(id: string){
        const account = await prisma.account.findUnique({
            where: {
                id
            },

            select: {
                user: true
            }
        });

        if(!account)
            throw new Error("Account does not exist.");
        
        if(!account.user)
            return null;

        return account.user;
    }





    static async scope(id: string){
        const account = await prisma.account.findUnique({
            where: {
                id
            },

            select: {
                scope: true
            }
        });

        if(!account)
            throw new Error("Account does not exist.");
        
        if(!account.scope)
            return null;

        return account.scope;
    }




}