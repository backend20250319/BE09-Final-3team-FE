"use client";

import { useParams } from "next/navigation";
import CampaignForm from "../../components/CampaignForm";
import SubHeader from "@/app/components/SubHeader";

export default function CampaignEditPage() {
  const params = useParams();
  return (
  <div>
    <SubHeader
      title = "캠페인 수정"
      subtitle = "기존에 등록한 캠페인 정보를 수정하고 최신 내용으로 업데이트해보세요"
    />
    <CampaignForm mode="edit" campaignId={params.ad_no} />
  </div>
  );
}