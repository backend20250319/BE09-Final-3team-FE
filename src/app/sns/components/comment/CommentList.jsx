"use client";

import { useState, useEffect } from "react";
import { getComments } from "../../lib/commentData";
import styles from "../../styles/comment/CommentList.module.css";
import CommentCard from "./CommentCard";
import Pagination from "./Pagination";

export default function CommentList() {
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsData, setCommentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments();
        setCommentsData(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return <div className={styles.commentListSection}>Loading...</div>;
  }

  // 필터링 로직
  const filteredComments = commentsData.filter((comment) => {
    if (filterBy === "all") return true;
    if (filterBy === "active") return comment.status === "승인됨";
    if (filterBy === "deleted") return comment.status === "삭제됨";
    if (filterBy === "positive") return comment.sentiment === "긍정";
    if (filterBy === "negative") return comment.sentiment === "부정";
    if (filterBy === "neutral") return comment.sentiment === "중립";
    return true;
  });

  // 정렬 로직
  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    if (sortBy === "sentiment") {
      const sentimentOrder = { 긍정: 3, 중립: 2, 부정: 1 };
      return sentimentOrder[b.sentiment] - sentimentOrder[a.sentiment];
    }
    return 0;
  });

  // 페이지네이션
  const commentsPerPage = 10;
  const totalPages = Math.ceil(sortedComments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = sortedComments.slice(
    startIndex,
    startIndex + commentsPerPage
  );

  return (
    <div className={styles.commentListSection}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>댓글 목록</h2>
        <div className={styles.filters}>
          {/* 필터 */}
          <select
            className={styles.select}
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="active">승인된 댓글</option>
            <option value="deleted">삭제된 댓글</option>
            <option value="positive">긍정</option>
            <option value="neutral">중립</option>
            <option value="negative">부정</option>
          </select>

          {/* 정렬 */}
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">최신순</option>
            <option value="sentiment">감정순</option>
          </select>
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className={styles.commentsList}>
        {currentComments.length > 0 ? (
          currentComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>표시할 댓글이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
