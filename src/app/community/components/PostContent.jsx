"use client";
import React, {useState} from "react";
import styles from "../styles/PostContent.module.css";
import Image from "next/image";
import ReportModal from "@/app/advertiser/ads-list/[ad_no]/components/ReportModal";

export default function PostContent({ post }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span className={styles.date}>{post.date}</span>
          <div className={styles.authorSection}>
            <div className={styles.commentCount}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
                  fill="#6B7280"
                />
              </svg>
              <div>
              <span className={styles.count}>{post.commentCount || 24}</span>
            </div>
            <span className={styles.author}>{post.author}</span>
          </div>
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
        <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            applicantName={post.author}
        />
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {post.content.map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
