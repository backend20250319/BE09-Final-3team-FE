import React, { useState, useEffect } from "react";
import styles from "../styles/CampaignGrid.module.css";
import CampaignCard from "./CampaignCard";
import { useCampaign } from "../context/CampaignContext";
import { getAllAdsByAdvertiser } from "@/api/advertisementApi";

function sortCampaigns(campaigns, sortBy, activeTab) {
  switch (sortBy) {
    case "recent":
      // 최신순
      return activeTab === "recruiting"
        ? [...campaigns].sort(
            (a, b) => new Date(a.announce_start) - new Date(b.announce_start)
          )
        : [...campaigns].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
    case "popular":
      // 인기순 (신청자 수 내림차순)
      return [...campaigns].sort((a, b) => {
        const getApplicantsNum = (str) =>
          Number((str || "0").split("/")[0].trim()) || 0;
        return getApplicantsNum(b.applicants) - getApplicantsNum(a.applicants);
      });
    case "selectedRecent":
      // 선정일 최신순 (체험단 선정일 내림차순)
      return [...campaigns].sort(
        (a, b) => new Date(b.campaign_select) - new Date(a.campaign_select)
      );
    case "selectedOld":
      // 선정일 오래된순 (체험단 선정일 오름차순)
      return [...campaigns].sort(
        (a, b) => new Date(a.campaign_select) - new Date(b.campaign_select)
      );
    case "trialEndedRecent":
      // 체험 종료일 최신순 (공고 종료일 내림차순)
      return [...campaigns].sort(
        (a, b) => new Date(b.campaign_end) - new Date(a.campaign_end)
      );
    case "trialEndedOld":
      // 체험 종료일 오래된 순 (공고 종료일 오름차순)
      return [...campaigns].sort(
        (a, b) => new Date(a.campaign_end) - new Date(b.campaign_end)
      );
    case "createdRecent":
      // 등록일 최신순 (공고 등록일 내림차순)
      return [...campaigns].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    case "createdOld":
      // 등록일 오래된 순 (공고 등록일 오름차순)
      return [...campaigns].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    case "endedRecent":
      // 종료일 최신순 (공고 종료일 내림차순)
      return [...campaigns].sort(
        (a, b) => new Date(b.announce_end) - new Date(a.announce_end)
      );
    case "endedOld":
      // 마감 임박순 & 종료일 오래된 순 (공고 종료일 오름차순)
      return [...campaigns].sort(
        (a, b) => new Date(a.announce_end) - new Date(b.announce_end)
      );
    default:
      return campaigns;
  }
}

export default function CampaignGrid({ searchQuery, sortBy }) {
  const { activeTab } = useCampaign();

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getAllAdsByAdvertiser(activeTab.toUpperCase());
        setCampaigns(data.ads || []);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [activeTab]);

  let filteredCampaigns = campaigns;

  const sortedCampaigns = sortCampaigns(filteredCampaigns, sortBy, activeTab);

  return (
    <section className={styles.campaignGrid}>
      <div className={styles.grid}>
        {sortedCampaigns.map((campaign) => (
          <CampaignCard key={campaign.adNo} campaign={campaign} />
        ))}
      </div>
    </section>
  );
}
