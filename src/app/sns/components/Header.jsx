import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>SNS 관리</h1>
      <p className={styles.subtitle}>
        회원님의 SNS를 간편하고 효율적으로 관리하세요.
      </p>
    </div>
  );
}
