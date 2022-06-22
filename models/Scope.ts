import ScopeUpdateForm from "../types/ScopeUpdateForm";

export default class Scope {

    static async updateById(id: string, form: ScopeUpdateForm){
        const updatedScope = await prisma.scope.update({
            where: {
                id
            },

            data: form
        });

        if(!updatedScope)
            return null;

        return updatedScope;
    }


    static async deleteById(id: string){
        const deleted = await prisma.scope.delete({
            where: {
                id
            }
        });

        if(deleted)
            return true;
        
        return false;
    }


    static async getAll() {
        const scopes = await prisma.scope.findMany();
         if(!scopes?.length)
            return [];

        return scopes;
    }


    static async deleteAll(): Promise<boolean> {
        const deleted = await prisma.scope.deleteMany();

        if(deleted)
            return true;

        return false;
    }





    static async accounts(id: string){
        const scope = await prisma.scope.findUnique({
            where: {
                id
            },

            select: {
                accounts: true
            }
        });

        if(!scope)
            throw new Error("Scope does not exist.");
        
        if(!scope.accounts?.length)
            return [];

        return scope.accounts;
    }



}