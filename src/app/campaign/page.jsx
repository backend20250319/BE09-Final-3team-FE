"use client";
import React, { useState, useEffect } from "react";
import SubHeader from "../components/SubHeader";
import TabNavigation from "./components/TabNavigation";
import SearchAndSort from "./components/SearchAndSort";
import CampaignGrid from "./components/CampaignGrid";
import Pagination from "./components/Pagination";
import { useCampaign } from "./context/CampaignContext";

export default function CampaignPage() {
  const {activeTab} = useCampaign();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const SORT_OPTIONS = {
      recruiting: [
        { value: "recent" },
        { value: "deadline" },
        { value: "popular" }
      ],
      ended: [
        { value: "endedRecent" },
        { value: "endedOld" },
        { value: "popular" }
      ],
      applied: [
        { value: "recent" },
        { value: "popular" }
      ]
    };

    setSortBy(SORT_OPTIONS[activeTab][0].value);
    setSearchQuery("");
  }, [activeTab]);

  return (
    <>
      <SubHeader title="체험단" subtitle="반려동물과 함께하는 특별한 상품 체험, 지금 바로 신청하고 경험해보세요" />
      <TabNavigation />
      <SearchAndSort
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <CampaignGrid searchQuery={searchQuery} sortBy={sortBy} />
      <Pagination />
    </>
  );
}
