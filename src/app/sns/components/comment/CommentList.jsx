"use client";

import { useState, useEffect } from "react";
import { getComments } from "../../lib/commentData";
import styles from "../../styles/comment/CommentList.module.css";
import CommentCard from "./CommentCard";
import Pagination from "./Pagination";

export default function CommentList() {
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [currentPage, setCurrentPage] = useState(1); // Spring Pagination: 1부터 시작
  const [commentsData, setCommentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const commentsPerPage = 10; // 페이지당 10개 댓글

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Spring Pagination 파라미터: page는 0부터 시작하므로 -1
        const springPage = currentPage - 1;

        // TODO: 실제 Spring Boot API 호출
        // const response = await fetch(`/api/comments?page=${springPage}&size=${commentsPerPage}&sort=${sortBy}&filter=${filterBy}`);
        // const pageData = await response.json();

        // 임시로 기존 데이터 사용 (실제 구현 시 위 코드로 교체)
        const allData = await getComments();

        // 클라이언트 사이드 페이징 시뮬레이션 (실제로는 서버에서 처리)
        const filteredData = allData.filter((comment) => {
          // 기본 필터 조건
          let passesFilter = false;
          if (filterBy === "all") passesFilter = true;
          if (filterBy === "active") passesFilter = comment.status === "승인됨";
          if (filterBy === "deleted")
            passesFilter = comment.status === "삭제됨";
          if (filterBy === "positive")
            passesFilter = comment.sentiment === "긍정";
          if (filterBy === "negative")
            passesFilter = comment.sentiment === "부정";
          if (filterBy === "neutral")
            passesFilter = comment.sentiment === "중립";

          // 검색어 필터 (사용자명 또는 댓글 내용에서 검색)
          let passesSearch = true;
          if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            passesSearch =
              comment.username.toLowerCase().includes(searchLower) ||
              comment.content.toLowerCase().includes(searchLower);
          }

          return passesFilter && passesSearch;
        });

        const sortedData = [...filteredData].sort((a, b) => {
          if (sortBy === "date") {
            return new Date(b.timestamp) - new Date(a.timestamp);
          }
          if (sortBy === "sentiment") {
            const sentimentOrder = { 긍정: 3, 중립: 2, 부정: 1 };
            return sentimentOrder[b.sentiment] - sentimentOrder[a.sentiment];
          }
          return 0;
        });

        // 페이징 처리
        const startIndex = springPage * commentsPerPage;
        const paginatedData = sortedData.slice(
          startIndex,
          startIndex + commentsPerPage
        );

        setCommentsData(paginatedData);
        setTotalElements(sortedData.length);
        setTotalPages(Math.ceil(sortedData.length / commentsPerPage));

        // 디버깅용 로그
        console.log("Pagination Debug:", {
          totalElements: sortedData.length,
          commentsPerPage,
          totalPages: Math.ceil(sortedData.length / commentsPerPage),
          currentPage,
        });

        /* 
        실제 Spring Boot 응답 처리:
        setCommentsData(pageData.content);
        setTotalElements(pageData.totalElements);
        setTotalPages(pageData.totalPages);
        */
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [currentPage, sortBy, filterBy, searchTerm]); // 페이지, 정렬, 필터, 검색어 변경 시 재조회

  if (loading) {
    return <div className={styles.commentListSection}>Loading...</div>;
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

  // 검색어 변경 시 첫 페이지로 이동
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
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
            <option value="sentiment">감정순</option>
          </select>
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className={styles.commentsList}>
        {commentsData.length > 0 ? (
          commentsData.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
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
