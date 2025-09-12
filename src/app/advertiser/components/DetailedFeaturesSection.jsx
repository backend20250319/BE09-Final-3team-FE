import styles from "../styles/DetailedFeaturesSection.module.css";
import { FiCheck } from "react-icons/fi";
import Image from "next/image";

export default function DetailedFeaturesSection() {
  const features = [
    {
      id: 1,
      title: "Add Your Campaign",
      subtitle: "캠페인 등록",
      description:
        "인플루언서 캠페인을 위해 브랜드 제품을 손쉽게 등록하고 인플루언서 캠페인을 위해 브랜드 제품을 손쉽게 등록하고 관리하세요. 제품의 상세 정보와 이미지를 입력해 상품을 효과적으로 소개하고, 몇 번의 클릭만으로 원하는 캠페인에 제품을 지정할 수 있습니다.",
      points: [
        "이미지와 설명을 포함한 간편한 상품 등록",
        "모든 등록된 상품을 한눈에 확인할 수 있는 대시보드 뷰",
        "실시간 편집, 업데이트 및 삭제",
      ],
      image: "/advertiser/campaignRegister.png",
      titleColor: "#F5A623",
    },
    {
      id: 2,
      title: "Track Applicants",
      subtitle: "지원자 확인",
      description:
        "모든 지원자의 진행 상황을 실시간으로 모니터링하세요.\n\n모든 인플루언서 지원서에 신속하게 접근하고, 서포터 정보를 검토하며, 승인 또는 거절을 효율적으로 처리하세요.",
      points: [
        "모든 현재 지원자와 상태의 실시간 개요",
        "인플루언서 소셜 통계와 지원서의 빠른 확인",
        "일괄 및 개별 승인/거절 도구",
      ],
      image: "/advertiser/applicants.png",
      titleColor: "#8BC34A",
      reverse: true,
    },
    {
      id: 3,
      title: "Find The Right Partner",
      subtitle: "펫스타 리스트 보기",
      description:
        "펫스타(인플루언서) 전체 리스트를 탐색하고 검색하여 캠페인에 가장 적합한 인플루언서를 찾아보세요. 필터와 AI 추천 기능으로 맞춤 연결이 가능합니다.",
      points: [
        "브랜드와 캠페인에 맞춘 AI 개인화 추천",
        "상세 프로필: 이력, 통계, 캠페인 성과 확인",
        "반려동물 종류, 팔로워 수, 참여도 기준 전수 탐색",
      ],
      image: "/advertiser/petstars.png",
      titleColor: "#FF7675",
    },
    {
      id: 4,
      title: "Optimize With AI",
      subtitle: "AI 기반 콘텐츠 수집 및 펫스타 추천",
      description:
        "광고하는 상품에 맞는 펫스타 인플루언서를 AI가 자동으로 찾아 추천해 드립니다. 인플루언서가 만드는 다양한 콘텐츠를 수집하고 분석해, 브랜드 및 상품에 가장 잘 어울리는 파트너를 쉽고 빠르게 연결해 줍니다.",
      points: [
        "인플루언서의 SNS 및 리뷰 콘텐츠 자동 수집",
        "상품 특성에 맞춰 최적의 펫스타를 AI가 추천",
        "추천 펫스타와의 효율적인 협업 지원",
      ],
      image: "/advertiser/petstarlists.png",
      titleColor: "#60A5FA",
      reverse: true,
    },
    {
      id: 5,
      title: "See All Results",
      subtitle: "리뷰 링크 관리",
      description:
        "모든 인플루언서 리뷰 콘텐츠를 한눈에 모아 체계적으로 관리할 수 있습니다. 게시 현황을 실시간으로 확인하고, 각 리뷰에 대해 손쉽게 피드백을 주고받으며 캠페인 성과를 효율적으로 평가할 수 있습니다.",
      points: [
        "캠페인별 리뷰 콘텐츠 통합 관리",
        "게시 여부 등 실시간 진행 상황 확인",
        "리뷰별 피드백 작성과 승인 처리를 간편하게 지원",
      ],
      image: "/advertiser/review.png",
      titleColor: "#C084FC",
    },
  ];

  return (
    <section className={styles.detailedFeatures}>
      <div className={styles.container}>
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`${styles.feature} ${
              feature.reverse ? styles.reverse : ""
            }`}
            data-aos="fade-up"
            data-aos-delay={index * 120}
            data-aos-duration="800"
          >
            <div className={styles.content}>
              <h3
                style={{ color: feature.titleColor }}
                className={styles.title}
                data-aos="fade-up"
                data-aos-delay={100}
                data-aos-duration="500"
              >
                {feature.title}
              </h3>
              <h4 
                className={styles.subtitle}
                data-aos="fade-up"
                data-aos-delay={200}
                data-aos-duration="500"
              >
                {feature.subtitle}
              </h4>
              <p 
                className={styles.description}
                data-aos="fade-up"
                data-aos-delay={300}
                data-aos-duration="500"
              >
                {feature.description.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < feature.description.split("\n").length - 1 && (
                      <br />
                    )}
                  </span>
                ))}
              </p>

              <ul className={styles.points}>
                {feature.points.map((point, pointIndex) => (
                  <li 
                    key={pointIndex} 
                    className={styles.point}
                    data-aos="fade-up"
                    data-aos-delay={400 + pointIndex * 150}
                    data-aos-duration="500"
                  >
                    <div className={styles.checkIcon}>
                      <FiCheck size={14} color={feature.titleColor} />
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div 
              className={styles.imageContainer}
              data-aos="zoom-in"
              data-aos-delay={150}
              data-aos-duration="900"
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={feature.image}
                  alt={feature.subtitle}
                  width={624}
                  height={624}
                  className={styles.image}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
