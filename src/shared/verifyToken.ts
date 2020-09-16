import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

export const decodeToken = (token): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.SECRET,
      { complete: true },
      (err, decoded) => {
        if (err) {
          const message = 'Token error: ' + (err.message || err.name);
          const error = new HttpException(message, HttpStatus.FORBIDDEN);
          reject(error);
        }
        resolve(decoded);
      },
    );
  });
};

export async function verifyToken(token: string): Promise<boolean> {
  try {
    return await Boolean(decodeToken(token));
  } catch (err) {
    throw err;
  }
}
