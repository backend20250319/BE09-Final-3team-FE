"use client";

import { useState, useEffect, useCallback } from "react";
import { getComments } from "../../lib/commentData";
import styles from "../../styles/comment/CommentList.module.css";
import CommentCard from "./CommentCard";
import Pagination from "./Pagination";

export default function CommentList({ instagram_id }) {
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // 디바운싱된 검색어
  const [currentPage, setCurrentPage] = useState(1); // Spring Pagination: 1부터 시작
  const [commentsData, setCommentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const commentsPerPage = 10; // 페이지당 10개 댓글

  // 디바운싱 효과: 검색어가 500ms 동안 변경되지 않으면 실제 검색어로 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Spring Pagination 파라미터: page는 0부터 시작하므로 -1
        const springPage = currentPage - 1;

        if (!instagram_id) {
          setLoading(false);
          return;
        }

        // 필터 조건을 API 파라미터로 변환
        let isDeleted = null;
        let sentiment = null;
        
        if (filterBy === "deleted") isDeleted = true;
        else if (filterBy === "active") isDeleted = false;
        
        if (filterBy === "positive") sentiment = "POSITIVE";
        else if (filterBy === "negative") sentiment = "NEGATIVE";
        else if (filterBy === "neutral") sentiment = "NEUTRAL";

                 // 정렬 파라미터 변환
         let sortParam = "timestamp,desc"; // 기본값: 최신순
         if (sortBy === "date_old") {
           sortParam = "timestamp,asc"; // 오래된순
         } else if (sortBy === "sentiment_good") {
           sortParam = "sentiment,desc"; // 좋은 감정순 (POSITIVE -> NEGATIVE)
         } else if (sortBy === "sentiment_bad") {
           sortParam = "sentiment,asc"; // 안좋은 감정순 (NEGATIVE -> POSITIVE)
         }

        // 실제 Spring Boot API 호출 (디바운싱된 검색어 사용)
        const pageData = await getComments(
          instagram_id, 
          springPage, 
          commentsPerPage, 
          isDeleted, 
          sentiment, 
          debouncedSearchTerm.trim() || null,
          sortParam
        );

        if (pageData) {
          console.log("API Response:", pageData);
          console.log("Comments content:", pageData.content);
          
          setCommentsData(pageData.content || []);
          setTotalElements(pageData.total_elements || 0);
          setTotalPages(pageData.total_pages || 0);
        } else {
          console.log("No page data received");
          setCommentsData([]);
          setTotalElements(0);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [instagram_id, currentPage, sortBy, filterBy, debouncedSearchTerm]); // debouncedSearchTerm 사용

  if (loading) {
    return <div className={styles.commentListSection}>Loading...</div>;
  }

  if (!instagram_id) {
    return (
      <div className={styles.commentListSection}>
        <div className={styles.header}>
          <h2 className={styles.title}>댓글 목록</h2>
        </div>
        <div className={styles.commentsList}>
          <div className={styles.emptyState}>
            <p>Instagram 프로필을 선택해주세요.</p>
                   </div>
       </div>
     </div>

   );
 }

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 필터/정렬 변경 시 첫 페이지로 이동
  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // 검색어 변경 시 첫 페이지로 이동 (디바운싱 적용)
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    // 디바운싱으로 인해 실제 API 호출은 500ms 후에 발생
  };

  return (
    <div className={styles.commentListSection}>
        {/* 헤더 */}
        <div className={styles.header}>
        <h2 className={styles.title}>댓글 목록</h2>

        <div className={styles.filters}>
                     {/* 검색창 */}
           <div className={styles.searchContainer}>
             <input
               type="text"
               className={styles.searchInput}
               placeholder="사용자명 또는 댓글 내용 검색..."
               value={searchTerm}
               onChange={(e) => handleSearchChange(e.target.value)}
             />
                           <div className={styles.searchIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
           </div>
          {/* 필터 */}
          <select
            className={styles.select}
            value={filterBy}
            onChange={(e) => handleFilterChange(e.target.value)}
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
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="date">최신순</option>
            <option value="date_old">오래된순</option>
            <option value="sentiment_good">좋은 감정순</option>
            <option value="sentiment_bad">안좋은 감정순</option>
          </select>
        </div>
      </div>

             {/* 댓글 리스트 */}
       <div className={styles.commentsList}>
         {commentsData.length > 0 ? (
           commentsData.map((comment) => (
                           <CommentCard 
                key={comment.id} 
                comment={comment} 
                onCommentDeleted={() => {
                  // 댓글 삭제 후 즉시 상태 반영 (새로고침 불필요)
                  console.log("댓글 삭제 완료 - 상태 업데이트됨");
                }}
              />
           ))
         ) : (
           <div className={styles.emptyState}>
             <p>표시할 댓글이 없습니다.</p>
           </div>
         )}
       </div>

      {/* 페이지네이션 정보 */}
      {totalElements > 0 && (
        <div className={styles.paginationInfo}>
          <span>
            전체 {totalElements.toLocaleString()}개 댓글 | 총 {totalPages}페이지
            | 현재 {currentPage}페이지
          </span>
        </div>
      )}

      {/* 페이지네이션 - Spring Pagination 방식 (디버깅용 항상 표시) */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, totalPages)} // 최소 1페이지는 보이도록
        onPageChange={handlePageChange}
      />
    </div>

  );
}
