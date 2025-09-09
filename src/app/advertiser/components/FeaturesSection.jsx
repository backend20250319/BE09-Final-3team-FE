import styles from "../../styles/FeatureCards.module.css";
import { FiBox, FiUsers, FiTarget, FiCpu, FiLink2 } from "react-icons/fi";

export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      icon: (
        <div className={styles.iconWrapper}>
          <FiBox size={36} color="#F5A623" />
        </div>
      ),
      title: "상품 등록",
      description: "간단하게 체험단\n모집하세요",
      color: "#F5A623",
    },
    {
      id: 2,
      icon: (
        <div className={styles.iconWrapper}>
          <FiUsers size={36} color="#8BC34A" />
        </div>
      ),
      title: "지원자 확인",
      description: "실시간으로 신청자\n진행상황을 한눈에\n확인하고 관리하세요",
      color: "#8BC34A",
    },
    {
      id: 3,
      icon: (
        <div className={styles.iconWrapper}>
          <FiTarget size={36} color="#FF7675" />
        </div>
      ),
      title: "펫스타 목록 조회",
      description: "맞춤형 펫스타를\n쉽게 찾아보세요",
      color: "#FF7675",
    },
    {
      id: 4,
      icon: (
        <div className={styles.iconWrapper}>
          <FiCpu size={36} color="#60A5FA" />
        </div>
      ),
      title: "AI 기반 콘텐츠 수집 및 펫스타 추천",
      description: "우리 브랜드에 맞는\n펫스타를 AI가 추천해줘요",
      color: "#60A5FA",
    },
    {
      id: 5,
      icon: (
        <div className={styles.iconWrapper}>
          <FiLink2 size={36} color="#C084FC" />
        </div>
      ),
      title: "리뷰 링크 관리",
      description: "리뷰 링크를 편리하게\n조회하고 정리할 수 있어요",
      color: "#C084FC",
    },
  ];

  return (
    <section className={styles.featureCardsSection}>
      <div className="container">
        <div 
          className={styles.sectionHeader}
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <h2 className={styles.sectionTitle}>광고주 전용 기능</h2>
        </div>

        <div className={styles.cardsGrid}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              data-aos="fade-up" 
              data-aos-delay={200 + index * 100}
              data-aos-duration="800"
              className={styles.card}
              style={{ borderTopColor: feature.color }}
            >
              <div className={styles.cardIcon}>{feature.icon}</div>

              <h3 className={styles.cardTitle}>{feature.title}</h3>

              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
