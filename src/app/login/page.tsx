"use client";

import styles from "./page.module.css";
import logoImg from "../../../public/img/logo.png";
import ic_visibility_off from "../../../public/img/ic_visibility_off.svg";
import ic_visibility_on from "../../../public/img/ic_visibility_on.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { login } from "../../api/admin";
export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(ic_visibility_off);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      console.log(response);
    } catch (error) {
      console.error(error);
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
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              이메일
            </label>
            <input
              type="email"
              id="email"
              className={styles.formInput + " " + styles.formInputEmail}
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              비밀번호
            </label>
            <input
              type={isVisible === ic_visibility_off ? "password" : "text"}
              id="password"
              className={styles.formInput + " " + styles.formInputPassword}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Image
              src={isVisible}
              alt="ic_visibility_off"
              width={24}
              height={24}
              className={styles.formInputIcon}
              onClick={() => {
                setIsVisible(
                  isVisible === ic_visibility_off
                    ? ic_visibility_on
                    : ic_visibility_off
                );
              }}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            로그인
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
