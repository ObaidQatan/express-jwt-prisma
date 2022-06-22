import dbConfig from "./db.config";
import tokensConfig from "./tokens.config";

const values: string[] = Object.values({
    ...dbConfig,
    ...tokensConfig
});

export default Object.keys({
    ...dbConfig,
    ...tokensConfig
}).map((key,i)=>(
    {
        key,
        value: values[i]
    }
))