import { exec, ExecException } from 'child_process';
import crypto from 'crypto';
import { appendFileSync, existsSync, readFileSync, unlink, writeFileSync } from 'fs';
import { join } from 'path';
import configs from './configs';

const ENV_PATH = join(process.cwd(),'.env');
/****************************************************************/
let primary_configs: Object[] = [
    {
        'DATABASE_URL': "postgresql://<username>:<password>@localhost:5432/<database_name>"
     },
    {
        'ACCESS_TOKEN_SECRET': crypto.randomBytes(64).toString('hex')
     },
    {
        'ACCESS_TOKEN_TYPE': "Bearer"
     },
    {
        'CRYPTO_SECRET':  crypto.randomBytes(32).toString('hex')
     },
    {
        'CRYPTO_IV': crypto.randomBytes(16).toString('hex')
     },
];
/****************************************************************/

console.log("generating .env file...");
    
try {

    let updated_configs = update_configs(configs, primary_configs);

    let template = ``;

    updated_configs.forEach(conf=>{
        template += `\n${conf.key}=${conf.value}\n`
    });

    if(existsSync(ENV_PATH)){
        let env_content = readFileSync(ENV_PATH, {encoding:'utf-8'}).toString();
        
        env_content = eliminate_env_vars(env_content, primary_configs.map(conf=>Object.keys(conf)[0]));
        env_content = env_content.trim();

        writeFileSync(ENV_PATH, env_content);
        appendFileSync(ENV_PATH, template);
        
    }else{
        writeFileSync(ENV_PATH, template);
    }

    console.log("\x1b[32m%s\x1b[0m",".env generated.");

    if(configs.find(conf => conf.key === 'DATABASE_URL')?.value.trim()){
        console.log("seeding to database...");

        exec('ts-node prisma/seed.ts', (err: ExecException | null, stdout: string, stderr: string)=>{
            if(err)
                throw err;
    
            console.log(stdout);
            console.log(stderr);
            console.log("\x1b[32m%s\x1b[0m","Generated Successfully");
        });
    } else {
        console.log("DATABASE_URL not found in your configs. Try adding it to your .env file then run 'npm run seed'.");
        setTimeout(() => {
            console.log("skipping seeding...");
            setTimeout(() => {
                console.log("\x1b[32m%s\x1b[0m","Generated Successfully");
            }, 500);
        }, 1000);
    }
    
} catch (error) {
    // unlink(join(process.cwd(),'.env'))
    console.log("\x1b[31m%s\x1b[0m","Generation Failed:\n",error);
}


function eliminate_env_vars(env_content: string, vars: string[]): EnvContent {
    
    vars.forEach(variable => {
        const start_index = env_content.indexOf(variable) + variable.length;
        let portion_to_be_eliminated = variable;

        for(let i=start_index; i<env_content.length; i++){
            if(env_content[i] === '\n')
                break;

            portion_to_be_eliminated += env_content[i];
        }

        env_content = env_content.replace(portion_to_be_eliminated, "");
    });

    return env_content;
}

function update_configs(configs: any[], primary_configs: any[]): any[] {
    let updated_configs = configs,
    configs_keys: string[] = configs.map(conf=>conf.key),
     primary_configs_keys: string[] = primary_configs.map(conf=>Object.keys(conf)[0]);

    primary_configs_keys.forEach((key,i)=>{
        if(configs_keys.includes(key) && !configs[configs_keys.indexOf(key)].value)
            updated_configs[configs_keys.indexOf(key)].value = primary_configs[i][key];

        else if(!configs_keys.includes(key))
            updated_configs.push(primary_configs[primary_configs_keys.indexOf(key)])
    });
    
    return updated_configs;
}

type EnvContent = string;