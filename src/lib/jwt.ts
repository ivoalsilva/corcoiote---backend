import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1d') as jwt.SignOptions['expiresIn'];

if (!JWT_SECRET) {
  throw new Error('A variável de ambiente JWT_SECRET não foi definida.');
}

const secret: string = JWT_SECRET;

export function signToken(userId: number): string {
  return jwt.sign({}, secret, {
    subject: String(userId),
    expiresIn: JWT_EXPIRES_IN
  });
}

export function verifyToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, secret);
    const userId = Number(typeof payload === 'string' ? NaN : payload.sub);

    return Number.isInteger(userId) ? userId : null;
  } catch {
    return null;
  }
}
