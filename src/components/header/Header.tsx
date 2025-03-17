import styles from "./header.module.css";
import Image from "next/image";

export default function Header() {
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
      <div className={styles.headerSearch}>
        <input
          type="text"
          placeholder="Employee Search"
          className={styles.headerSearchInput}
        />
        <button className={styles.headerSearchButton}>Search</button>
      </div>
    </div>
  );
}
