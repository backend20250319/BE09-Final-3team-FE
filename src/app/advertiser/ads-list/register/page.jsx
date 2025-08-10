"use client";

import React from 'react';
import SubHeader from "@/app/components/SubHeader";
import CampaignForm from '../components/CampaignForm';

export default function CampaignRegisterPage() {

  return (
    <main style={{ flex: 1 }}>
      <SubHeader
        title="캠페인 등록"
        subtitle="반려동물 인플루언서와 소통하기 위한 새로운 광고 캠페인을 만들어보세요"
      />
      <CampaignForm mode="create" />
    </main>
  );
}
