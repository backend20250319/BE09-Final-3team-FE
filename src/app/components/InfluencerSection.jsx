"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/InfluencerSection.module.css";
import { getPetstar } from "@/api/advertisementApi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function InfluencerSection() {
  const pathname = usePathname();
  const router = useRouter();
  const [petstars, setPetstars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API에서 펫스타 데이터를 가져와서 랜덤으로 선택하는 함수
  const fetchRandomPetstars = async () => {
    try {
      setLoading(true);
      const allPetstars = await getPetstar();
      
      // 최대 8개의 펫스타를 랜덤으로 선택
      const shuffled = allPetstars.sort(() => 0.5 - Math.random());
      const selectedPetstars = shuffled.slice(0, Math.min(8, allPetstars.length));
      
      setPetstars(selectedPetstars);
    } catch (err) {
      console.error('펫스타 데이터를 가져오는데 실패했습니다:', err);
      setError('펫스타 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPetstars();
  }, []);

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
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>펫스타 정보를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button 
                onClick={fetchRandomPetstars}
                className={styles.retryButton}
              >
                다시 시도
              </button>
            </div>
          ) : petstars.length === 0 ? (
            <div className={styles.emptyContainer}>
              <p>표시할 펫스타가 없습니다.</p>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Navigation]}
              slidesPerView={4}
              spaceBetween={24}
              loop={petstars.length > 4}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                prevEl: "#influencer-prev",
                nextEl: "#influencer-next",
              }}
              className={styles.mySwiper}
            >
              {petstars.map((influencer) => (
                <SwiperSlide key={influencer.petNo || influencer.id}>
                  <div className={styles.influencerCard}>
                    <div className={styles.cardImage}>
                      <Image
                        src={influencer.profileImage || influencer.image || '/user/avatar-placeholder.jpg'}
                        alt={influencer.petName || influencer.name}
                        width={256}
                        height={256}
                        className={styles.profileImage}
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.userInfo}>
                        <div className={styles.petInfo}>
                          <h3 className={styles.petName}>{influencer.petName || influencer.name}</h3>
                          <p className={styles.petBreed}>{influencer.breed}</p>
                        </div>
                      </div>
                      <div className={styles.statsInfo}>
                        <span className={styles.username}>{influencer.snsId || influencer.sns_profile}</span>
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
                            {influencer.followers ? `${Math.floor(influencer.followers / 1000)}K` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <p className={styles.description}>
                        {influencer.description || '사랑스러운 펫스타입니다.'}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {!loading && !error && petstars.length > 0 && (
            <div className={styles.sliderControls}>
              <button
                className={styles.sliderButton}
                id="influencer-prev"
                aria-label="이전 슬라이드"
                type="button"
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
                id="influencer-next"
                aria-label="다음 슬라이드"
                type="button"
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
          )}
        </div>

        {pathname === "/advertiser" && (
          <div className={styles.viewAllContainer}>
            <a href="advertiser/petstar-list" className={styles.viewAllLink}>
              <span>모든 펫스타 목록</span>
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
        )}
      </div>
    </section>
  );
}