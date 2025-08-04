"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../styles/CampaignSection.module.css";

export default function CampaignSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const campaigns = [
    {
      id: 1,
      image: "/campaign-1.jpg",
      price: "$500-1000",
      brand: {
        name: "PawsomeNutrition",
        logo: "/brand-1.jpg",
      },
      title: "Organic Pet Food Campaign",
      description:
        "Looking for dogs and cats to showcase our new organic food line. 3 posts required.",
      deadline: "7일 후 마감",
    },
    {
      id: 2,
      image: "/campaign-2.jpg",
      price: "$300-600",
      brand: {
        name: "FunnyTails",
        logo: "/brand-2.jpg",
      },
      title: "Interactive Toy Launch",
      description:
        "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      deadline: "14시간 후 마감",
    },
    {
      id: 3,
      image: "/campaign-3.jpg",
      price: "$400-800",
      brand: {
        name: "PetGlam",
        logo: "/brand-3.jpg",
      },
      title: "Grooming Kit Promotion",
      description:
        "Looking for well-groomed dogs to showcase our premium grooming products.",
      deadline: "10일 후 마감",
    },
    {
      id: 4,
      image: "/campaign-4.jpg",
      price: "$600-1200",
      brand: {
        name: "PetAdventures",
        logo: "/brand-4.jpg",
      },
      title: "Travel Accessories Launch",
      description:
        "Seeking pets who love to travel for our new line of travel accessories and carriers.",
      deadline: "21일 후 마감",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % campaigns.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  return (
    <section className={styles.campaignSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>진행 중인 체험단</h2>
          <p className={styles.sectionSubtitle}>
            당신과 같은 펫 인플루언서를 찾고 있는 브랜드들과 연결해보세요.
          </p>
        </div>

        <div className={styles.campaignSlider}>
          <div className={styles.campaignGrid}>
            {campaigns.map((campaign, index) => (
              <div key={campaign.id} className={styles.campaignCard}>
                <div className={styles.cardImage}>
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    width={288}
                    height={160}
                    className={styles.campaignImage}
                  />
                  <div className={styles.priceTag}>{campaign.price}</div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.brandInfo}>
                    <div className={styles.brandLogo}>
                      <Image
                        src={campaign.brand.logo}
                        alt={campaign.brand.name}
                        width={32}
                        height={32}
                        className={styles.brandImage}
                      />
                    </div>
                    <span className={styles.brandName}>
                      {campaign.brand.name}
                    </span>
                  </div>

                  <h3 className={styles.campaignTitle}>{campaign.title}</h3>

                  <p className={styles.campaignDescription}>
                    {campaign.description}
                  </p>

                  <div className={styles.cardFooter}>
                    <span className={styles.deadline}>{campaign.deadline}</span>
                    <button className={styles.applyButton}>신청하기</button>
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
          <a href="#all-campaigns" className={styles.viewAllLink}>
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
