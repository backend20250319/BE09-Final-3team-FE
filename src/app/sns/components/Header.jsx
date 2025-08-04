import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>SNS 관리</h1>
      <p className={styles.subtitle}>소제목</p>
    </div>
  );
}
