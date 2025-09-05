"use client";
import FeedAnalysis from "./components/feed/FeedAnalysis";
import CommentManagement from "./components/comment/CommentManagement";
import { useSns } from "./context/SnsContext";
import ProfileSelector from "./components/ProfileSelector";

export default function SnsPage() {
  const { activeTab } = useSns();

  return (
    <>
      <ProfileSelector />

      {/* 조건부 렌더링 */}
      {activeTab === "feed" && <FeedAnalysis />}
      {activeTab === "comment" && <CommentManagement />}

    </>
  );
}
