import crypto from 'crypto';
import { config } from 'dotenv';
config();

export function decipher(encryptedStr: string){
    const secret = Buffer.from(process.env.CRYPTO_SECRET || "", 'hex');
    const iv = Buffer.from(process.env.CRYPTO_IV || "", 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv);
    let decrypted = decipher.update(encryptedStr, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
