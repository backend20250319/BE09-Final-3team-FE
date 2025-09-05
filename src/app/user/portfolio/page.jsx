"use client";
import React, { Suspense } from "react";
import PortfolioContent from "./PortfolioContent";

const PortfolioPage = () => {
  return (
    <Suspense fallback={<div>포트폴리오를 불러오는 중...</div>}>
      <PortfolioContent />
    </Suspense>
  );
};

export default PortfolioPage;
