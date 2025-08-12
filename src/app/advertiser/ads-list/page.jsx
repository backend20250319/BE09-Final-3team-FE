"use client";

import React, { useState, useEffect } from "react";
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
          closed: [
            { value: "selectedRecent", label: "선정일 최신순" },
            { value: "selectedOld", label: "선정일 최신순" }
          ],
          trial: [
            { value: "trialEndedRecent", label: "체험 종료일 최신순" },
            { value: "tiralEndedOld", label: "체험 종료일 오래된순" }
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
          ]
      };
  
      setSortBy(SORT_OPTIONS[activeTab][0].value);
      setSearchQuery("");
    }, [activeTab]);

  return(
    <>
      <main style={{ flex: 1, height: "1000px" }}>
        <SubHeader
          title="체험단 광고 목록"
          subtitle="체험단 광고를 직접 등록하고 다양한 지원자들의 신청 현황을 한눈에 관리해보세요"
        />
        <TabNavigation />
        <SearchAndSort
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <CampaignGrid searchQuery={searchQuery} sortBy={sortBy} />
      </main>
      <Pagination />
    </>
    
  );
}