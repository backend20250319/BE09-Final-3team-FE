"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../styles/InfluencerSection.module.css";
import petstars from "../advertiser/petstar-list/data/PetStars";

export default function InfluencerSection() {
  // 현재 시작 인덱스
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + 1 > petstars.length - itemsPerPage ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - 1 < 0 ? petstars.length - itemsPerPage : prev - 1
    );
  };

  // 보여줄 카드만 추출
  const visiblePetstars = petstars.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className={styles.influencerSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>펫스타 인플루언서</h2>
          <p className={styles.sectionSubtitle}>
            가장 인기 있는 펫스타들을 소개합니다
          </p>
        </div>

        <div className={styles.influencerSlider}>
          <div className={styles.influencerGrid}>
            {visiblePetstars.map((influencer) => (
              <div key={influencer.id} className={styles.influencerCard}>
                <div className={styles.cardImage}>
                  <Image
                    src={influencer.image}
                    alt={influencer.name}
                    width={256}
                    height={256}
                    className={styles.profileImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.userInfo}>
                    <div className={styles.petInfo}>
                      <h3 className={styles.petName}>{influencer.name}</h3>
                      <p className={styles.petBreed}>{influencer.breed}</p>
                    </div>
                  </div>

                  <div className={styles.statsInfo}>
                    <span className={styles.username}>
                      {influencer.sns_profile}
                    </span>
                    <div className={styles.followersBox}>
                      <div className={styles.followersIcon}>
                        <svg
                          width="16"
                          height="14"
                          viewBox="0 0 16 14"
                          fill="none"
                        >
                          <path
                            d="M8 13.32C12.6667 10.6667 16 7.64 16 4.5C16 1.96 13.84 0 11.5 0C9.74 0 8.5 1 8 1.5C7.5 1 6.26 0 4.5 0C2.16 0 0 1.96 0 4.5C0 7.64 3.33333 10.6667 8 13.32Z"
                            fill="#FF7675"
                          />
                        </svg>
                      </div>
                      <span className={styles.followersCount}>
                        {influencer.followers}
                      </span>
                    </div>
                  </div>

                  <p className={styles.description}>
                    {influencer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sliderControls}>
            <button
              className={styles.sliderButton}
              onClick={prevSlide}
              aria-label="이전 슬라이드"
            >
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <path
                  d="M8 1L1 8L8 15"
                  stroke="#594A3E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className={styles.sliderButton}
              onClick={nextSlide}
              aria-label="다음 슬라이드"
            >
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <path
                  d="M2 1L9 8L2 15"
                  stroke="#594A3E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
