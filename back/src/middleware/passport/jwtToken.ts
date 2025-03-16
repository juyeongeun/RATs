import { Strategy as JwtStrategy } from "passport-jwt";
import { Request } from "express";
import adminRepository from "../../repository/adminRepository";

interface CustomError extends Error {
  status?: number;
  data?: any;
}

const accessExtractor = function (req: Request) {
  const cookieString = req.headers.cookie;
  let accessToken = "";

  if (cookieString?.includes("access-token=")) {
    const cookie = cookieString
      .split("; ")
      .find((c) => c.startsWith("access-token="));
    if (cookie) {
      accessToken = cookie.split("=")[1];
    }
  }

  if (!accessToken) {
    return null; // 빈 문자열 대신 null 반환
  }

  return accessToken;
};

const refreshExtractor = function (req: Request) {
  const cookieString = req.headers.cookie;
  let refreshToken = "";

  if (cookieString?.includes("refresh-token=")) {
    const cookie = cookieString
      .split("; ")
      .find((c) => c.startsWith("refresh-token="));
    if (cookie) {
      refreshToken = cookie.split("=")[1];
    }
  }

  if (!refreshToken) {
    const error = new Error("Forbidden") as CustomError;
    error.status = 403;
    error.data = {
      message: "유효하지 않은 리플레쉬 토큰입니다.",
      "refresh-token": refreshToken,
    };
    throw error;
  }

  return refreshToken;
};

const accessTokenOptions = {
  jwtFromRequest: accessExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: refreshExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

async function jwtVerify(payload: any, done: any) {
  try {
    const { id } = payload;

    if (!id) {
      return done(null, false);
    }

    const { admin: user } = await adminRepository.getAdminById(id);

    if (!user) {
      return done(null, false);
    }
    return done(null, user); // admin 객체만 전달
  } catch (error) {
    return done(error);
  }
}

//리퀘스트의 관리자 정보를 담아줌  -> req.user
export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions as any,
  jwtVerify
);
export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions as any,
  jwtVerify
);
