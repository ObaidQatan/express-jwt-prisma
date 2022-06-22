import { sign, Secret, SignOptions } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const secret: Secret = process.env.ACCESS_TOKEN_SECRET||'secret';

export default function generateAccessToken(payload: object, options?: SignOptions) {
    return new Promise<string>((resolve, reject) => {
        sign(payload, secret, options||{}, (err: Error|null, token: string|undefined) => {
            if (err) {
                reject(err);
            } else {
                resolve(token||'No Token');
            }
        });
    });
}
