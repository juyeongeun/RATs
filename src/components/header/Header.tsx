import styles from "./header.module.css";
import Image from "next/image";
import { useState } from "react";
export default function Header({
  handleSearch,
}: {
  handleSearch: (keyword: string) => void;
}) {
  const [keyword, setKeyword] = useState("");
  return (
    <div className={styles.headerContainer}>
      <Image
        src="/img/logo.png"
        alt="logo"
        width={100}
        height={100}
        className={styles.headerLogo}
        priority
      />
      <h1 className={styles.headerTitle}>Auto Absenteeism Management</h1>
      <form
        className={styles.headerSearch}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(keyword);
        }}
      >
        <input
          type="text"
          placeholder="Employee Search"
          className={styles.headerSearchInput}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className={styles.headerSearchButton}>Search</button>
      </form>
    </div>
  );
}
