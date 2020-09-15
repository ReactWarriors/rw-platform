import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function verifyToken(token: string): Promise<boolean> {
  try {
    return await jwt.verify(
      token,
      process.env.SECRET,
      { complete: true },
      (err, decoded) => {
        console.log('decoded ->', decoded);
      },
    );
  } catch (err) {
    const message = 'Token error: ' + (err.message || err.name);
    throw new HttpException(message, HttpStatus.FORBIDDEN);
  }
}
