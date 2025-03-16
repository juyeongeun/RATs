import tokenRepository from "../repository/tokenRepository";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const refreshToken = async (userId: number, refreshToken: string) => {
  try {
    const user = await tokenRepository.getAdminById(userId);

    if (!user) {
      const error = new Error("Not found") as any;
      error.status = 404;
      error.data = {
        message: "등록된 사용자가 없습니다.",
      };
      throw error;
    }

    if (refreshToken !== user.refreshToken) {
      const error = new Error("Forbidden") as any;
      error.status = 403;
      error.data = {
        message: "리프레쉬 토큰이 유효하지 않습니다.",
      };
      throw error;
    }

    // 새로운 액세스 토큰 생성
    const accessToken = generateAccessToken(user.id, user.email);

    // 새 토큰 토큰을 DB에 저장
    await tokenRepository.updateAccessToken(user.id, accessToken);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    throw error;
  }
};

// 액세스 토큰 생성 함수
const generateAccessToken = (userId: number, email: string) => {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET as string,
    { expiresIn: "1h" } // 액세스 토큰 유효 시간: 1시간
  );
};

export default { refreshToken, generateAccessToken };
