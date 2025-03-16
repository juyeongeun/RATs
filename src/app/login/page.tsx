"use client";

import styles from "./page.module.css";
import logoImg from "../../../public/img/logo.png";
import ic_visibility_off from "../../../public/img/ic_visibility_off.svg";
import ic_visibility_on from "../../../public/img/ic_visibility_on.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { login } from "@/api/admin";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation, LoginForm } from "../util/loginValidation";

export default function LoginPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginValidation),
    mode: "onChange",
  });

  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible);
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login(data.email, data.password);
      useAdminStore.setState({
        id: response.id,
        email: response.email,
      });
      router.push("/check");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <Image
          src={logoImg}
          alt="logo"
          width={150}
          height={100}
          className={styles.logo}
        />

        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          <FormField
            id="email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            register={register}
            error={errors.email}
            className={styles.formInputEmail}
          />

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              비밀번호
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                type={isVisible ? "text" : "password"}
                id="password"
                className={`${styles.formInput} ${styles.formInputPassword} ${
                  errors.password ? styles.error : ""
                }`}
                placeholder="비밀번호를 입력하세요"
                {...register("password")}
              />
              <Image
                src={isVisible ? ic_visibility_on : ic_visibility_off}
                alt={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
                width={24}
                height={24}
                className={styles.formInputIcon}
                onClick={togglePasswordVisibility}
              />
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className={styles.signupLink}>
          <span>아직 회원이 아니신가요? </span>
          <Link href="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

// 재사용 가능한 폼 필드 컴포넌트
interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  register: any;
  error?: any;
  className?: string;
}

function FormField({
  id,
  label,
  type,
  placeholder,
  register,
  error,
  className,
}: FormFieldProps) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={styles.formLabel}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        className={`${styles.formInput} ${className} ${
          error ? styles.error : ""
        }`}
        placeholder={placeholder}
        {...register(id)}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </div>
  );
}
