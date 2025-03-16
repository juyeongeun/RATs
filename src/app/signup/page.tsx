"use client";

import styles from "./page.module.css";
import logoImg from "../../../public/img/logo.png";
import ic_visibility_off from "../../../public/img/ic_visibility_off.svg";
import ic_visibility_on from "../../../public/img/ic_visibility_on.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [isVisible, setIsVisible] = useState(ic_visibility_off);
  const [isVisibleCheck, setIsVisibleCheck] = useState(ic_visibility_off);
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
        <form className={styles.signupForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              이메일
            </label>
            <input
              type="email"
              id="email"
              className={styles.formInput + " " + styles.formInputEmail}
              placeholder="이메일을 입력하세요"
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
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              비밀번호 확인
            </label>
            <input
              type={isVisibleCheck === ic_visibility_off ? "password" : "text"}
              id="password"
              className={styles.formInput + " " + styles.formInputPassword}
              placeholder="비밀번호를 한 번 더 입력해주세요"
            />
            <Image
              src={isVisibleCheck}
              alt="ic_visibility_off"
              width={24}
              height={24}
              className={styles.formInputIcon}
              onClick={() => {
                setIsVisibleCheck(
                  isVisibleCheck === ic_visibility_off
                    ? ic_visibility_on
                    : ic_visibility_off
                );
              }}
            />
          </div>
          <button type="submit" className={styles.signupButton}>
            회원가입
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
