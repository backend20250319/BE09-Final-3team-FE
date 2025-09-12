"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "../styles/CampaignSection.module.css";
import { getAdsGrouped, getImageByAdNo, getAdvertiserFile, getPets } from "../../api/campaignApi";
import AlertModal from "../advertiser/components/AlertModal";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function CampaignSection() {
  const router = useRouter();
  const [recruitingAds, setRecruitingAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaignImages, setCampaignImages] = useState({});
  const [advertiserImages, setAdvertiserImages] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  // 로그인 상태 확인 및 펫 정보 가져오기
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // 초기 로그인 상태 확인
    checkLoginStatus();

    // 로그인된 사용자의 펫 정보 가져오기
    const fetchUserPets = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const petsData = await getPets();
          setUserPets(petsData || []);
        } catch (error) {
          console.error("펫 정보를 가져오는데 실패했습니다:", error);
          setUserPets([]);
        }
      } else {
        setUserPets([]);
      }
    };

    fetchUserPets();

    // 로컬 스토리지 변경 감지
    const handleStorageChange = () => {
      checkLoginStatus();
      fetchUserPets();
    };

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인/로그아웃 시)
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("loginStatusChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStatusChanged", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchRecruitingAds = async () => {
      try {
        const adsData = await getAdsGrouped();
        
        // recruitingAds가 있는지 확인하고 랜덤으로 섞기
        if (adsData.recruitingAds && adsData.recruitingAds.length > 0) {
          const shuffledAds = adsData.recruitingAds.sort(() => Math.random() - 0.5);
          setRecruitingAds(shuffledAds);
          
          // 각 캠페인의 이미지 데이터 가져오기
          const imagePromises = shuffledAds.map(async (campaign) => {
            try {
              const [adImageData, advImageData] = await Promise.all([
                getImageByAdNo(campaign.adNo),
                getAdvertiserFile(campaign.advertiser.advertiserNo)
              ]);
              
              // 광고주 이미지 중 type이 PROFILE인 것만 필터링
              const profileImage = Array.isArray(advImageData) 
                ? advImageData.find(img => img.type === "PROFILE")
                : advImageData;
              
              return {
                adNo: campaign.adNo,
                adImage: adImageData,
                advImage: profileImage
              };
            } catch (error) {
              console.error(`Failed to fetch images for campaign ${campaign.adNo}:`, error);
              return {
                adNo: campaign.adNo,
                adImage: null,
                advImage: null
              };
            }
          });
          
          const imageResults = await Promise.all(imagePromises);
          
          // 이미지 데이터를 객체로 변환
          const campaignImagesMap = {};
          const advertiserImagesMap = {};
          
          imageResults.forEach(result => {
            campaignImagesMap[result.adNo] = result.adImage;
            advertiserImagesMap[result.adNo] = result.advImage;
          });
          
          setCampaignImages(campaignImagesMap);
          setAdvertiserImages(advertiserImagesMap);
        } else {
          setRecruitingAds([]);
        }
      } catch (error) {
        console.error("Failed to fetch recruiting ads:", error);
        setRecruitingAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitingAds();
  }, []);

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
          {loading ? (
            <div className={styles.loadingContainer}>
              <p>캠페인을 불러오는 중</p>
            </div>
          ) : recruitingAds.length > 0 ? (
            <Swiper
              modules={[Autoplay, Navigation]}
              slidesPerView={4}
              spaceBetween={20}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                prevEl: "#swiper-prev",
                nextEl: "#swiper-next",
              }}
              className={styles.mySwiper}
            >
              {recruitingAds.map((campaign) => (
                <SwiperSlide key={campaign.adNo}>
                  <div className={styles.campaignCard}>
                    <div className={styles.cardImage}>
                      <Image
                        src={campaignImages[campaign.adNo]?.filePath || "/campaign/default_brand.png"}
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
                            src={advertiserImages[campaign.adNo]?.filePath || "/campaign/default_brand.png"}
                            alt={campaign.advertiser?.name}
                            width={32}
                            height={32}
                            className={styles.brandImage}
                          />
                        </div>
                        <span className={styles.brandName}>{campaign.advertiser?.name}</span>
                      </div>
                      <h3 className={styles.campaignTitle}>{campaign.title}</h3>
                      <p className={styles.campaignDescription}>{campaign.objective}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.deadline}>
                          {campaign.announceStart} ~ {campaign.announceEnd}
                        </span>
                        <button
                          className={styles.applyButton}
                          onClick={() => {
                            if (!isLoggedIn) {
                              router.push("/user/login");
                            } else if (userPets.length === 0) {
                              setAlertModal({
                                isOpen: true,
                                title: "반려동물 등록 필요",
                                message: "체험단 신청을 위해서는 반려동물을 먼저 등록해주세요.",
                                type: "warning"
                              });
                            } else {
                              router.push(`/campaign/application/${campaign.adNo}`);
                            }
                          }}
                        >
                          {"신청하기"}
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className={styles.noCampaignsContainer}>
              <p>현재 모집 중인 캠페인이 없습니다.</p>
            </div>
          )}

          <div className={styles.sliderControls}>
            <button
              className={styles.sliderButton}
              id="swiper-prev"

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
              id="swiper-next"
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
        </div>
      </div>

      {/* AlertModal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </section>
  );
}
