"use client";

import React, { useState, useEffect } from "react";
import SubHeader from "@/app/components/SubHeader";
import SearchAndSort from "./components/SearchAndSort";
import Pagination from "@/app/campaign/components/Pagination";
import PetstarGrid from "./components/PetStarGrid";

export default function PetStarListPage() {

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const SORT_OPTIONS = [
    { value: "followers", label: "팔로워 순" },
    { value: "costHigh", label: "단가 높은 순"},
    { value: "costLow", label: "단가 낮은 순"}
  ];

  useEffect(() => {
    setSortBy(SORT_OPTIONS[0].value);
    setSearchQuery("");
  }, []);

  return (
    <main>
      <SubHeader
        title = "펫스타 목록"
        subtitle = "신뢰할 수 있는 인플루언서와의 협업을 통해 브랜드 인지도와 소비자 신뢰를 함께 성장시켜 보세요" />
      <SearchAndSort
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <PetstarGrid searchQuery={searchQuery} sortBy={sortBy} />
      <Pagination />
    </main>
  );
}