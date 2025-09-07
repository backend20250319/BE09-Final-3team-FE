"use client";
import FeedAnalysis from "./components/feed/FeedAnalysis";
import CommentManagement from "./components/comment/CommentManagement";
import { useSns } from "./context/SnsContext";
import ProfileSelector from "./components/ProfileSelector";

export default function SnsPage() {
  const { activeTab, selectedInstagramProfile, setSelectedInstagramProfile } =
    useSns();

  const handleProfileSelect = (profileData) => {
    console.log("SNS 페이지에서 프로필 선택:", profileData);
    setSelectedInstagramProfile(profileData);
  };

  return (
    <>
      <ProfileSelector
        onProfileSelect={handleProfileSelect}
        selectedProfileId={selectedInstagramProfile?.id}
        selectedProfileUsername={selectedInstagramProfile?.username}
      />

      {/* 조건부 렌더링 */}
      {activeTab === "feed" && <FeedAnalysis />}
      {activeTab === "comment" && <CommentManagement />}
    </>
  );
}
