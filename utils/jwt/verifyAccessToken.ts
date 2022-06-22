import { Secret, verify } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const secret: Secret = process.env.ACCESS_TOKEN_SECRET||'secret';

export default function verifyAccessToken(token: string) {
    return new Promise<any>((resolve, reject) => {
        verify(token, secret, (err: Error|null, payload: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    });
}