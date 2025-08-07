"use client";
import React, {useState} from "react";
import NoticeHeader from "./components/NoticeHeader";
import NoticeList from "./components/NoticeList";
import Pagination from "./components/Pagination";
import styles from "./styles/page.module.css";

export default function NoticePage() {
  const [activeTab,setActiveTab] = useState("정보");
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <NoticeHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
          <div className={styles.listContainer}>
            <NoticeList activeTab={activeTab}/>
          </div>
          <div className={styles.paginationContainer}>
            <Pagination />
          </div>
        </section>
      </main>
    </div>
  );
}
