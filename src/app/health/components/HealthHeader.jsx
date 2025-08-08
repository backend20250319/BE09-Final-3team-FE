import styles from "../styles/HealthHeader.module.css";

export default function HealthHeader() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>건강 관리</h1>
      <p className={styles.subtitle}>
        반려동물의 건강 활동과 의료 기록을 추적하고 관리하세요.
      </p>
    </div>
  );
}
