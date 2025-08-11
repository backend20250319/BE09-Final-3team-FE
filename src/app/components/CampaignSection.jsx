"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../styles/CampaignSection.module.css";
import campaigns from "../campaign/data/campaigns";

export default function CampaignSection() {
  const router = useRouter();
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + 1 > campaigns.length - itemsPerPage ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - 1 < 0 ? campaigns.length - itemsPerPage : prev - 1
    );
  };

  const visibleCampaigns = campaigns.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <section className={styles.campaignSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>진행 중인 체험단</h2>
          <p className={styles.sectionSubtitle}>
            당신과 같은 펫 인플루언서를 찾고 있는 브랜드들과 연결해보세요
          </p>
        </div>

        <div className={styles.campaignSlider}>
          <div className={styles.campaignGrid}>
            {visibleCampaigns.map((campaign) => (
              <div key={campaign.ad_no} className={styles.campaignCard}>
                <div className={styles.cardImage}>
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    width={288}
                    height={160}
                    className={styles.campaignImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.brandInfo}>
                    <div className={styles.brandLogo}>
                      <Image
                        src={campaign.brand_url}
                        alt={campaign.brand}
                        width={32}
                        height={32}
                        className={styles.brandImage}
                      />
                    </div>
                    <span className={styles.brandName}>{campaign.brand}</span>
                  </div>
                  <h3 className={styles.campaignTitle}>{campaign.title}</h3>
                  <p className={styles.campaignDescription}>
                    {campaign.objective}
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.deadline}>
                      {campaign.announce_start}~{campaign.announce_end}
                    </span>
                    <button
                    className={styles.applyButton}
                    onClick={() => {
                      if (campaign.ad_no === 1) {
                        router.push("/campaign/1");
                      }
                    }}
                  >
                    신청하기
                  </button>
                  </div>
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

        <div className={styles.viewAllContainer}>
          <a href="campaign" className={styles.viewAllLink}>
            <span>모든 체험단 목록</span>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
              <path
                d="M1 6H13M13 6L8 1M13 6L8 11"
                stroke="#F5A623"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
