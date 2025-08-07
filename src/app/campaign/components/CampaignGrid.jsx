import React from "react";
import styles from "../styles/CampaignGrid.module.css";
import CampaignCard from "./CampaignCard";
import { useCampaign } from "../context/CampaignContext";
import campaigns from "../data/campaigns";

const APPLIED_STATUSES = ["applied", "pending", "selected", "rejected", "completed"];

function isTodayInAnnouncePeriod(announce_start, announce_end) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(announce_start);
  const endDate = new Date(announce_end);

  // period 경계 포함 범위 검사
  return startDate <= today && today <= endDate;
}

function sortCampaigns(campaigns, sortBy, activeTab) {
  switch (sortBy) {
    case "recent":
      // 최신순
      return activeTab === "recruiting" ? 
        [...campaigns].sort((a, b) => new Date(a.announce_start) - new Date(b.announce_start)) :
        [...campaigns].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) ;
    case "deadline":
      // 마감 임박순 (공고 종료일 오름차순)
      return [...campaigns].sort((a, b) => new Date(a.announce_end) - new Date(b.announce_end));
    case "popular":
      // 인기순 (신청자 수 내림차순)
      return [...campaigns].sort((a, b) => {
        const getApplicantsNum = (str) => Number((str || "0").split("/")[0].trim()) || 0;
        return getApplicantsNum(b.applicants) - getApplicantsNum(a.applicants);
      });
    case "endedRecent":
      // 종료일 최신순 (공고 종료일 내림차순)
      return [...campaigns].sort((a, b) => new Date(b.announce_end) - new Date(a.announce_end));
    case "endedOld":
      // 종료일 오래된 순 (공고 종료일 오름차순)
      return [...campaigns].sort((a, b) => new Date(a.announce_end) - new Date(b.announce_end));
    default:
      return campaigns;
  }
}

export default function CampaignGrid({searchQuery, sortBy}) {

  const { activeTab } = useCampaign();

  let filteredCampaigns = [];

  switch (activeTab) {
    case "recruiting":
      filteredCampaigns = campaigns.filter(c => isTodayInAnnouncePeriod(c.announce_start, c.announce_end) && c.ad_status === "approved");
      break;
    case "ended":
      filteredCampaigns = campaigns.filter(c => c.ad_status === "ended");
      break;
    case "applied":
      filteredCampaigns = campaigns.filter(c => APPLIED_STATUSES.includes(c.applicant_status));
      break;
    default:
      filteredCampaigns = campaigns;
  }

  const sortedCampaigns = sortCampaigns(filteredCampaigns, sortBy, activeTab);

  return (
    <section className={styles.campaignGrid}>
      <div className={styles.grid}>
        {sortedCampaigns.map((campaign) => (
          <CampaignCard key={campaign.ad_no} campaign={campaign} />
        ))}
      </div>
    </section>
  );
}