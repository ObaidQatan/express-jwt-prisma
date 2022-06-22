import crypto, { Hmac } from 'crypto';
import { config } from 'dotenv';
config();

export function cipher(str: string): string {
    const secret = Buffer.from(process.env.CRYPTO_SECRET || "", 'hex');
    const iv = Buffer.from(process.env.CRYPTO_IV || "", 'hex');

    const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final("hex");
    
    return encrypted;
}
