import styles from "../styles/InfluencersSection.module.css";
import {
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";
import Image from "next/image";

export default function InfluencersSection() {
  const influencers = [
    {
      id: 1,
      name: "Buddy",
      breed: "Golden Retriever",
      username: "@goldenbuddy",
      followers: "245K",
      description:
        "Adventure-loving golden who enjoys beach days and hiking trails with his human.",
      avatar: "/placeholder-avatar-1.jpg",
      coverImage: "/placeholder-cover-1.jpg",
    },
    {
      id: 2,
      name: "Luna",
      breed: "Siamese Cat",
      username: "@lunathesiamese",
      followers: "189K",
      description:
        "Elegant and sassy Siamese who loves luxury cat beds and gourmet treats.",
      avatar: "/placeholder-avatar-2.jpg",
      coverImage: "/placeholder-cover-2.jpg",
    },
    {
      id: 3,
      name: "Bruno",
      breed: "French Bulldog",
      username: "@brunothefrenchie",
      followers: "320K",
      description:
        "Playful Frenchie with a big personality and an even bigger wardrobe collection.",
      avatar: "/placeholder-avatar-3.jpg",
      coverImage: "/placeholder-cover-3.jpg",
    },
    {
      id: 4,
      name: "Max",
      breed: "Maine Coon",
      username: "@magnificent_max",
      followers: "178K",
      description:
        "Majestic Maine Coon who loves to show off his impressive size and fluffy coat.",
      avatar: "/placeholder-avatar-4.jpg",
      coverImage: "/placeholder-cover-4.jpg",
    },
  ];

  return (
    <section className={styles.influencers}>
      <div className={styles.container}>
        <h2 className={styles.title}>펫스타 인플루언서</h2>
        <p className={styles.subtitle}>가장 인기 있는 펫스타들을 소개합니다</p>

        <div className={styles.carouselContainer}>
          <div className={styles.grid}>
            {influencers.map((influencer) => (
              <div key={influencer.id} className={styles.card}>
                <div className={styles.coverImage}>
                  <Image
                    src={influencer.coverImage}
                    alt={influencer.name}
                    width={256}
                    height={256}
                    className={styles.cover}
                  />
                  <div className={styles.overlay}>
                    <h3 className={styles.name}>{influencer.name}</h3>
                    <p className={styles.breed}>{influencer.breed}</p>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.userInfo}>
                    <div className={styles.userDetails}>
                      <Image
                        src={influencer.avatar}
                        alt={influencer.username}
                        width={32}
                        height={32}
                        className={styles.avatar}
                      />
                      <span className={styles.username}>
                        {influencer.username}
                      </span>
                    </div>

                    <div className={styles.stats}>
                      <FiHeart size={16} color="#FF7675" />
                      <span className={styles.followers}>
                        {influencer.followers}
                      </span>
                    </div>
                  </div>

                  <p className={styles.description}>{influencer.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.navigation}>
            <button className={styles.navButton}>
              <FiChevronLeft size={16} />
            </button>
            <button className={styles.navButton}>
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className={styles.viewAll}>
          <span className={styles.viewAllText}>
            모든 펫스타 인플루언서 확인
          </span>
          <FiArrowRight size={14} color="#F5A623" />
        </div>
      </div>
    </section>
  );
}
