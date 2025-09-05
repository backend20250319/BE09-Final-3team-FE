import styles from "../styles/CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          PetFul에 가입할 준비가 되셨나요?
        </h2>
        <p className={styles.subtitle}>
          지금 바로 PetFul을 시작하고 반려동물 인플루언서와 함께 더 큰 성과를
          만들어 보세요.
          <br />
          이미 수많은 광고주들이 Petful과 함께 효과적인 마케팅을 진행하고
          있습니다.
        </p>

        <div className={styles.buttonContainer}>
          <button className={styles.signUpButton}>계정 만들기</button>
        </div>
      </div>
    </section>
  );
}
