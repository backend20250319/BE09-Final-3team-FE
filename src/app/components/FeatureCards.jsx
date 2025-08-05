import styles from "../styles/FeatureCards.module.css";

export default function FeatureCards() {
  const cards = [
    {
      id: 1,
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 34C27.9411 34 36 25.9411 36 16C36 6.05887 27.9411 -2 18 -2C8.05887 -2 0 6.05887 0 16C0 25.9411 8.05887 34 18 34Z" fill="#F5A623"/>
          <path d="M23 10L14 19L10 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "체험단",
      description: "브랜드와 연결하여 반려동물의 영향력을 수익화하세요",
      color: "#F5A623",
    },
    {
      id: 2,
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 34C27.9411 34 36 25.9411 36 16C36 6.05887 27.9411 -2 18 -2C8.05887 -2 0 6.05887 0 16C0 25.9411 8.05887 34 18 34Z" fill="#8BC34A"/>
          <path d="M8 16L14 22L28 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "펫 관리",
      description: "모든 반려동물을 위한 프로필 및 포트폴리오 만들기",
      color: "#8BC34A",
    },
    {
      id: 3,
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 34C27.9411 34 36 25.9411 36 16C36 6.05887 27.9411 -2 18 -2C8.05887 -2 0 6.05887 0 16C0 25.9411 8.05887 34 18 34Z" fill="#FF7675"/>
          <path d="M18 8V18L24 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "건강관리",
      description: "반려동물의 건강 상태를 추적하고 일상을 체계적으로 관리해보세요.",
      color: "#FF7675",
    },
    {
      id: 4,
      icon: (
        <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
          <path d="M16 34C25.9411 34 34 25.9411 34 16C34 6.05887 25.9411 -2 16 -2C6.05887 -2 -2 6.05887 -2 16C-2 25.9411 6.05887 34 16 34Z" fill="#60A5FA"/>
          <path d="M6 15L12 21L26 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "SNS 관리",
      description: "반려동물의 소셜 미디어 활동을 분석하고 성장시켜보세요.",
      color: "#60A5FA",
    },
    {
      id: 5,
      icon: (
        <svg width="45" height="36" viewBox="0 0 45 36" fill="none">
          <path d="M22.5 34C32.4411 34 40.5 25.9411 40.5 16C40.5 6.05887 32.4411 -2 22.5 -2C12.5589 -2 4.5 6.05887 4.5 16C4.5 25.9411 12.5589 34 22.5 34Z" fill="#C084FC"/>
          <path d="M13.5 15L19.5 21L31.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "커뮤니티",
      description: "다른 반려동물 애호가들과 팁을 공유하고 소통하세요",
      color: "#C084FC",
    },
  ];

  return (
    <section className={styles.featureCardsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>당신이 필요한 모든 것</h2>
        </div>
        
        <div className={styles.cardsGrid}>
          {cards.map((card) => (
            <div 
              key={card.id} 
              className={styles.card}
              style={{ borderTopColor: card.color }}
            >
              <div className={styles.cardIcon}>
                {card.icon}
              </div>
              
              <h3 className={styles.cardTitle}>
                {card.title}
              </h3>
              
              <p className={styles.cardDescription}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}