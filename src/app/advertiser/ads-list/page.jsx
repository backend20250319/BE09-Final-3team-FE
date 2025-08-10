"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SubHeader from "@/app/components/SubHeader";
import TabNavigation from "./components/TabNavigation";
import SearchAndSort from "./components/SearchAndSort";
import { useCampaign } from "./context/CampaignContext";
import CampaignGrid from "./components/CampaignGrid";
import Pagination from "@/app/campaign/components/Pagination";

export default function adsListPage() {

    const {activeTab} = useCampaign();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");
  
    useEffect(() => {
      const SORT_OPTIONS = {
          approved: [
            { value: "recent", label: "최신순" },
            { value: "endedRecent", label: "마감 임박순" },
            { value: "popular", label: "인기순" }
          ],
          pending: [
            { value: "createdRecent", label: "등록일 최신순" },
            { value: "createdOld", label: "등록일 오래된순" }
          ],
          rejected: [
            { value: "createdRecent", label: "등록일 최신순" },
            { value: "createdOld", label: "등록일 오래된순" },
            { value: "endedRecent", label: "종료일 최신순" },
            { value: "endedOld", label: "종료일 오래된순" }
          ],
          ended: [
            { value: "endedRecent", label: "종료일 최신순" },
            { value: "endedOld", label: "종료일 오래된순" },
            { value: "popular", label: "인기순" }
          ],
      };
  
      setSortBy(SORT_OPTIONS[activeTab][0].value);
      setSearchQuery("");
    }, [activeTab]);

  return(
    <main style={{ flex: 1 }}>
      <SubHeader
        title="체험단 광고 목록"
        subtitle="체험단 광고를 직접 등록하고 다양한 지원자들의 신청 현황을 한눈에 관리해보세요"
      />
      <div style={{ padding: "0 144px", marginBottom: "32px" }}>
        <Link href="/advertiser/ads-list/register">
          <button style={{
            backgroundColor: "#F5A623",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#E0941A"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#F5A623"}
          >
            캠페인 등록
          </button>
        </Link>
      </div>
      <TabNavigation />
      <SearchAndSort
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <CampaignGrid searchQuery={searchQuery} sortBy={sortBy} />
      <Pagination />
    </main>
  );
}