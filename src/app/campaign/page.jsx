"use client";
import React, { useState, useEffect } from "react";
import SubHeader from "../components/SubHeader";
import TabNavigation from "./components/TabNavigation";
import SearchAndSort from "./components/SearchAndSort";
import CampaignGrid from "./components/CampaignGrid";
import Pagination from "./components/Pagination";
import { useCampaign } from "./context/CampaignContext";
import PostUrlModal from "./components/PostUrlModal";

export default function CampaignPage() {
  const {activeTab} = useCampaign();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    setCurrentPage(1); // 탭 변경 시 첫 페이지로 리셋
  }, [activeTab]);

  // 검색어나 정렬 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCampaign, setModalCampaign] = useState(null);

  const openModal = (campaign) => {
    setModalCampaign(campaign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCampaign(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTotalPagesChange = (pages) => {
    setTotalPages(pages);
  };

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
      <CampaignGrid 
        searchQuery={searchQuery} 
        sortBy={sortBy} 
        openModal={openModal}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onTotalPagesChange={handleTotalPagesChange}
      />
      {isModalOpen && <PostUrlModal isOpen={isModalOpen} onClose={closeModal} campaignData={modalCampaign} />}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
