//@ts-nocheck

import jwt from "jsonwebtoken";
import config from "../../config";

interface UserPayload {
  id?: string;
  email?: string;
  role?: string;
}

type TokenType = "access" | "refresh";

const secretMap: Record<TokenType, string> = {
  access: config.accessTokenSecret,
  refresh: config.refreshTokenSecret,
};

const expireMap: Record<TokenType, string> = {
  access: config.accessTokenExp,
  refresh: config.refreshTokenExp,
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
