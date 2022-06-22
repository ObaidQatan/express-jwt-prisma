import crypto from 'crypto';
import { config } from 'dotenv';
config();

export function toHash(str: string): string {
    const secret = process.env.CRYPTO_SECRET ||"";
    const hash = crypto.createHmac('sha256', secret).update(str).digest('hex');

    return hash;
}