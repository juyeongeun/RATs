import { z } from "zod";

export const signupValidation = z
  .object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    passwordCheck: z.string(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

export type SignupForm = z.infer<typeof signupValidation>;
