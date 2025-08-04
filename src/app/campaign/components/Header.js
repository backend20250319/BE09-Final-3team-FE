import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>체험단</h1>
        <p className={styles.subtitle}>
          반려동물과 함께하는 특별한 상품 체험, 지금 바로 신청하고 경험해보세요.
        </p>
      </div>
    </header>
  );
}