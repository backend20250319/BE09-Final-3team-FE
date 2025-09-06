"use client";

import styles from "../styles/ApplicationHeader.module.css"
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

export default function ApplicationHeader() {

  const router = useRouter();
  const params = useParams();

  const handleBack = () => {
    router.push(`/campaign/info/${params.ad_no}`);
  };
  
  return(
    <>
      {/* 이전 페이지 이동 버튼  */}
      <div>
        <button className={styles.backButton} onClick={handleBack}>
          <Image
            src="/campaign/arrow.png"
            alt="arrow.png"
            width={14}
            height={12}
            className={styles.backIcon}
          />
          체험단 상세 화면으로 이동
        </button>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>체험단 신청서</h1>
          <p className={styles.subtitle}>선택한 캠페인에 대한 지원서를 작성해주세요</p>
        </div>
      </div>
    </>
  );
}