//@ts-nocheck

import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";

interface UserPayload {
  id?: string;
  email?: string;
  role?: string;
}

type TokenType = "access" | "refresh" | "reset";

const secretMap: Record<TokenType, string> = {
  access: config.accessTokenSecret,
  refresh: config.refreshTokenSecret,
  reset: config.forget_pass_secret,
};

const expireMap: Record<TokenType, string> = {
  access: config.accessTokenExp,
  refresh: config.refreshTokenExp,
  reset: config.forget_pass_exp,
};

export const generateToken = (
  user: UserPayload,
  type: TokenType = "access"
): string => {
  // console.log(user);

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secretMap[type],
    {
      expiresIn: expireMap[type],
    }
  );
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as UserPayload;
};
