import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
    // Seed to your db here
}

main()
.catch(e=>{
    console.log(e);
    process.exit(1);
})
.finally(async ()=>{
    await prisma.$disconnect();
});