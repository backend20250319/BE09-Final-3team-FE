import styles from "../styles/CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2 
          className={styles.title}
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          PetFul에 가입할 준비가 되셨나요?
        </h2>
        <p 
          className={styles.subtitle}
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          지금 바로 PetFul을 시작하고 반려동물 인플루언서와 함께 더 큰 성과를
          만들어 보세요.
          <br />
          이미 수많은 광고주들이 Petful과 함께 효과적인 마케팅을 진행하고
          있습니다.
        </p>

        <div 
          className={styles.buttonContainer}
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="800"
        >
        </div>
      </div>
    </section>
  );
}
