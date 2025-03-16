"use client";

import styles from "./page.module.css";
import logoImg from "../../../public/img/logo.png";
import ic_visibility_off from "../../../public/img/ic_visibility_off.svg";
import ic_visibility_on from "../../../public/img/ic_visibility_on.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signup } from "@/api/admin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupValidation, SignupForm } from "../util/signupValidation";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    passwordCheck: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupValidation),
    mode: "onChange",
  });

  const toggleVisibility = (field: "password" | "passwordCheck") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup(data.email, data.password);
      router.push("/login");
    } catch (error) {
      // 모달 넣어주기
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <Image
          src={logoImg}
          alt="logo"
          width={150}
          height={100}
          className={styles.logo}
        />
        <form className={styles.signupForm} onSubmit={handleSubmit(onSubmit)}>
          <FormField
            id="email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            register={register}
            error={errors.email}
            className={styles.formInputEmail}
          />

          <PasswordField
            id="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            register={register}
            error={errors.password}
            isVisible={passwordVisibility.password}
            toggleVisibility={() => toggleVisibility("password")}
          />

          <PasswordField
            id="passwordCheck"
            label="비밀번호 확인"
            placeholder="비밀번호를 한 번 더 입력해주세요"
            register={register}
            error={errors.passwordCheck}
            isVisible={passwordVisibility.passwordCheck}
            toggleVisibility={() => toggleVisibility("passwordCheck")}
          />

          <button
            type="submit"
            className={styles.signupButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "회원가입"}
          </button>
        </form>

        <div className={styles.loginLink}>
          <span>이미 회원이신가요? </span>
          <Link href="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}

// 기본 입력 필드 컴포넌트
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
        className={`${styles.formInput} ${className || ""} ${
          error ? styles.error : ""
        }`}
        placeholder={placeholder}
        {...register(id)}
      />
      {error && <p className={styles.errorMessage}>{error.message}</p>}
    </div>
  );
}

// 비밀번호 입력 필드 컴포넌트
interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  register: any;
  error?: any;
  isVisible: boolean;
  toggleVisibility: () => void;
}

function PasswordField({
  id,
  label,
  placeholder,
  register,
  error,
  isVisible,
  toggleVisibility,
}: PasswordFieldProps) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={styles.formLabel}>
        {label}
      </label>
      <div className={styles.passwordInputContainer}>
        <input
          type={isVisible ? "text" : "password"}
          id={id}
          className={`${styles.formInput} ${styles.formInputPassword} ${
            error ? styles.error : ""
          }`}
          placeholder={placeholder}
          {...register(id)}
        />
        <Image
          src={isVisible ? ic_visibility_on : ic_visibility_off}
          alt={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
          width={24}
          height={24}
          className={styles.formInputIcon}
          onClick={toggleVisibility}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error.message}</p>}
    </div>
  );
}
