import Header from "@/components/header/Header";
import styles from "./page.module.css";
export default function Check() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.line}></div>
    </div>
  );
}
