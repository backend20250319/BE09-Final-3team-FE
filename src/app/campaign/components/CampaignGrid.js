import Image from "next/image";
import styles from "../styles/CampaignGrid.module.css";
import CampaignCard from "./CampaignCard";

export default function CampaignGrid() {
  const campaigns = [
    {
      id: 1,
      image: "/campaign-1.jpg",
      title: "유기농 반려동물 사료",
      description: "새롭게 선보일 프리미엄 유기농 사료를 직접 체험해 볼 반려견과 반려묘를 모집합니다.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.08.01 - 2025.08.31",
      status: "recruiting",
      statusText: "모집중",
      borderColor: "#FF8484",
    },
    {
      id: 2,
      image: "/campaign-2.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.08.01 - 2025.08.31",
      status: "actions",
      statusText: "수정",
      statusText2: "삭제",
      borderColor: "#8BC34A",
    },
    {
      id: 3,
      image: "/campaign-3.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.07.01 - 2025.07.31",
      status: "verification",
      statusText: "확인 절차중",
      borderColor: "#8BC34A",
    },
    {
      id: 4,
      image: "/campaign-4.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.07.01 - 2025.07.31",
      status: "selection_failed",
      statusText: "선발 완료(X)",
      borderColor: "#6B7280",
    },
    {
      id: 5,
      image: "/campaign-5.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.07.01 - 2025.07.31",
      status: "url_submit",
      statusText: "게시물 url 등록",
      borderColor: "#8BC34A",
    },
    {
      id: 6,
      image: "/campaign-6.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.07.01 - 2025.07.31",
      status: "completed",
      statusText: "광고 완료",
      borderColor: "#6B7280",
    },
    {
      id: 7,
      image: "/campaign-7.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.07.01 - 2025.07.31",
      status: "ended",
      statusText: "모집 종료",
      borderColor: "#6B7280",
    },
    {
      id: 8,
      image: "/campaign-8.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.07.01 - 2025.07.31",
      status: "ended",
      statusText: "모집 종료",
      borderColor: "#6B7280",
    },
    {
      id: 9,
      image: "/campaign-9.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.07.01 - 2025.07.31",
      status: "ended",
      statusText: "모집 종료",
      borderColor: "#6B7280",
    },
    {
      id: 10,
      image: "/campaign-10.jpg",
      title: "Interactive Toy Launch",
      description: "Seeking playful cats to feature with our new interactive toys. Video content preferred.",
      brand: "PawsomeNutrition",
      applicants: "45 / 100",
      period: "2025.07.01 - 2025.07.31",
      status: "ended",
      statusText: "모집 종료",
      borderColor: "#6B7280",
    },
  ];

  return (
    <section className={styles.campaignGrid}>
      <div className={styles.grid}>
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </section>
  );
}