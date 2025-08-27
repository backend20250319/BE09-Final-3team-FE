"use client";
import React, {useState} from "react";
import NoticeHeader from "./components/NoticeHeader";
import NoticeList from "./components/NoticeList";
import Pagination from "./components/Pagination";
import styles from "./styles/page.module.css";

export default function NoticePage() {
  const [activeTab,setActiveTab] = useState("정보 공유");
  const [page,setPage] = useState(0);
  const [totalPages,setTotalPages] = useState(0);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <NoticeHeader activeTab={activeTab} setActiveTab={(t) => {setActiveTab(t); setPage(0) }}/>
          <div className={styles.listContainer}>
            <NoticeList activeTab={activeTab} page={page} size={10} onLoaded={(data) => {
              // Page 응답이면 totalPages 사용
              const tp =
                  data?.totalPages ??
                  (typeof data?.totalElements === "number"
                      ? Math.ceil(data.totalElements / 10)
                      : 0);
              setTotalPages(tp);
            }}/>
          </div>
          <div className={styles.paginationContainer}>
            <Pagination page={page} onChange={setPage} totalPages={totalPages}  />
          </div>
        </section>
      </main>
    </div>
  );
}
