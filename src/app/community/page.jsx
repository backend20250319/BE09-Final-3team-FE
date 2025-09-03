"use client";
import React, { useEffect, useState } from "react";
import NoticeHeader from "./components/NoticeHeader";
import NoticeList from "./components/NoticeList";
import Pagination from "./components/Pagination";
import styles from "./styles/page.module.css";

export default function NoticePage() {
  const PAGE_SIZE = 5;

  // 탭 값은 서버 PostType과 매핑되는 문자열을 사용 (예: "ALL" | "INFORMATION" | "QNA")
  const [activeTab, setActiveTab] = useState("INFORMATION");
  const [mineOnly, setMineOnly] = useState(false);

  // 페이지네이션 상태 (0-based)
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 탭/내글 보기 변경 시: 페이지/전체페이지 초기화 (잔상 제거)
  useEffect(() => {
    setPage(0);
    setTotalPages(0);
  }, [activeTab, mineOnly]);

  // 서버 응답을 기준으로 totalPages 설정 (백업 계산도 PAGE_SIZE 사용)
  const handleLoaded = (data) => {
    const tp =
      typeof data?.totalPages === "number"
        ? data.totalPages
        : typeof data?.totalElements === "number"
        ? Math.ceil(data.totalElements / PAGE_SIZE)
        : 0;
    setTotalPages(tp);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <NoticeHeader
            activeTab={activeTab}
            onChangeType={setActiveTab}
            mineOnly={mineOnly}
            onToggleMine={() => setMineOnly((v) => !v)}
          />

          <div className={styles.listContainer}>
            {/* 탭/내글 토글이 바뀔 때 리스트를 remount해서 이전 요청 잔상 방지 */}
            <NoticeList
              key={`${activeTab}-${mineOnly}`}
              activeTab={activeTab}
              mineOnly={mineOnly}
              page={page}
              size={PAGE_SIZE}
              onLoaded={handleLoaded}
            />
          </div>

          <div className={styles.paginationContainer}>
            <Pagination
              page={page}
              onChange={setPage}
              totalPages={totalPages}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
