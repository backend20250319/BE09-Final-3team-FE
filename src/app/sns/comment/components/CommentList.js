"use client";

import { useState } from "react";
import styles from "../styles/CommentList.module.css";
import CommentCard from "./CommentCard";
import Pagination from "./Pagination";

export default function CommentList() {
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const commentsData = [
    {
      id: 1,
      username: "@petlover_sarah",
      avatar: "👩‍🦰",
      sentiment: "긍정",
      sentimentColor: "#DCFCE7",
      status: "Active",
      statusColor: "#F3F4F6",
      text: "Such a beautiful dog! My Golden Retriever would love to play with yours. 🐕❤️",
      timeAgo: "2 hours ago",
      bgColor: "#FFFFFF",
    },
    {
      id: 2,
      username: "Mike Johnson",
      avatar: "👨‍💼",
      sentiment: "중립",
      sentimentColor: "#F3F4F6",
      status: "Active",
      statusColor: "#F3F4F6",
      text: "What breed is this? Looks similar to my neighbor's dog.",
      timeAgo: "4 hours ago",
      bgColor: "#FFFFFF",
    },
    {
      id: 3,
      username: "@angrytroll",
      avatar: "😠",
      sentiment: "부정",
      sentimentColor: "#FEE2E2",
      status: "Auto-deleted",
      statusColor: "#FECACA",
      text: "This is spam content and hate speech...",
      timeAgo: "Auto-deleted 6 hours ago - Contains banned words",
      bgColor: "#FEF2F2",
      isDeleted: true,
    },
    {
      id: 4,
      username: "Emma Wilson",
      avatar: "👩‍🎨",
      sentiment: "긍정",
      sentimentColor: "#DCFCE7",
      status: "Active",
      statusColor: "#F3F4F6",
      text: "Amazing video! Your dog is so well trained. Could you share some training tips?",
      timeAgo: "1 day ago",
      bgColor: "#FFFFFF",
    },
    {
      id: 5,
      username: "@dogmom_jenny",
      avatar: "🐕",
      sentiment: "중립",
      sentimentColor: "#F3F4F6",
      status: "Active",
      statusColor: "#F3F4F6",
      text: "Where did you get that collar? My dog needs one like that.",
      timeAgo: "2 days ago",
      bgColor: "#FFFFFF",
    },
  ];

  return (
    <div className={styles.commentListSection}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>댓글</h2>

        <div className={styles.filters}>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="sentiment">Sort by Sentiment</option>
            <option value="author">Sort by Author</option>
          </select>

          <select
            className={styles.select}
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Sentiments</option>
            <option value="positive">긍정</option>
            <option value="neutral">중립</option>
            <option value="negative">부정</option>
          </select>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className={styles.commentsList}>
        {commentsData.map((comment) => (
          <CommentCard key={comment.id} {...comment} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalComments={1247}
        commentsPerPage={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
