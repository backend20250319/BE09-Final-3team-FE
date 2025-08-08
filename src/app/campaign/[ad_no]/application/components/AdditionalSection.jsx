"use client";

import { useState } from "react";
import styles from "../styles/AdditionalSection.module.css"

export default function AdditinalSection() {
  const [additionalContent, setAdditionalContent] = useState('');

  return (
    <>
      {/* Additional Content Section */}
      <div className={styles.additionalSection}>
        <h4 className={styles.additionalTitle}>추가 내용 작성</h4>
        <textarea 
          className={styles.additionalTextarea}
          placeholder={"브랜드에 반려동물이 이 캠페인에 적합한 이유를 알려주세요\n관련 경험 또는 독특한 특징을 공유하세요"}
          value={additionalContent}
          onChange={(e) => setAdditionalContent(e.target.value)}
        />
        <p className={styles.additionalNote}>선택 사항: 체험단 선정에 도움이 될 수 있는 추가 정보를 기입해주세요</p>
      </div>
    </>
  );
}