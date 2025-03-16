import { CookieOptions } from "express";

const accessTokenOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  maxAge: 1000 * 60 * 60,
};

const refreshTokenOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  maxAge: 1000 * 60 * 60 * 24,
};

const clearAccessTokenOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  maxAge: 0,
};

const clearRefreshTokenOption: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  maxAge: 0,
};

export default {
  accessTokenOption,
  refreshTokenOption,
  clearAccessTokenOption,
  clearRefreshTokenOption,
};
