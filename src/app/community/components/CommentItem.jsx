"use client";
import React from "react";
import styles from "../styles/CommentItem.module.css";
import ReportModal from "@/app/advertiser/ads-list/[ad_no]/components/ReportModal";
import {useState} from "react";
import Image from "next/image";

export default function CommentItem({ comment }) {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <img
        src={comment.avatar}
        alt={comment.author}
        className={styles.avatar}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{comment.author}</span>
          <span className={styles.time}>{comment.time}</span>
        </div>
        <p className={styles.text}>{comment.content}</p>
          <div style={{justifyContent:"space-between" , display:"flex"}}>
        <button className={styles.replyButton}>
          <svg
            className={styles.replyIcon}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M7 12L6.5 11.5C3.5 8.5 1 6.5 1 4C1 2.5 2 1.5 3.5 1.5C4.5 1.5 5.5 2 6 3C6.5 2 7.5 1.5 8.5 1.5C10 1.5 11 2.5 11 4C11 6.5 8.5 8.5 5.5 11.5L7 12Z"
              fill="currentColor"
            />
          </svg>
          답글 달기
        </button>
              <button
                  className={styles.sirenButton}
                  onClick={() => {
                      setIsReportModalOpen(true);
                  }}
                  style={{backgroundColor:"white"}}
              >
                  <Image
                      src="/siren.png"
                      alt="siren.png"
                      width={30}
                      height={30} />
              </button>
          </div>
          <ReportModal
              isOpen={isReportModalOpen}
              onClose={() => setIsReportModalOpen(false)}
              applicantName={comment?.author}
          />
      </div>
    </div>
  );
}
