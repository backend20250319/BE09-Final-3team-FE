"use client";
import React, {useState} from "react";
import NoticeHeader from "./components/NoticeHeader";
import NoticeList from "./components/NoticeList";
import Pagination from "./components/Pagination";
import styles from "./styles/page.module.css";

export default function NoticePage() {
  const [activeTab,setActiveTab] = useState("INFORMATION");
  const [page,setPage] = useState(0);
  const [totalPages,setTotalPages] = useState(0);
  const [mineOnly,setMineOnly] = useState(false);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <NoticeHeader activeTab={activeTab} onChangeType={setActiveTab} mineOnly={mineOnly} onToggleMine={()=>setMineOnly((v)=>!v)}/>
          <div className={styles.listContainer}>
            <NoticeList activeTab={activeTab} mineOnly={mineOnly} onLoaded={(data) => {
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
