// PostContent.jsx
"use client";
import React, { useMemo, useState } from "react";
import styles from "../styles/PostContent.module.css";
import Image from "next/image";
import ReportModal from "@/app/advertiser/ads-list/[ad_no]/components/ReportModal";

export default function PostContent({ post = {}, onDelete, onChange }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const title = post.title ?? "";
  const author = post.author ?? "익명";
  const date = post.date ?? "";
  const commentCount = Number(post.commentCount ?? 0);

  // 문자열이어도 배열이어도 OK
  const paragraphs = useMemo(() => {
    if (Array.isArray(post.content)) return post.content.map(String);
    if (typeof post.content === "string") {
      // 줄바꿈 기준으로 나눠보면 빈칸처럼 보이는 문제 방지
      return post.content.split(/\r?\n/);
    }
    return [];
  }, [post.content]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.top}>
          <div>
          <h1 className={styles.title}>{title}</h1>
          </div>
          {post.mine && (
              <div>
              <span
                  className={styles.deleteText}
                  onClick={onDelete}
                  role="button"
                  style={{marginRight:"10px"}}
              >
                게시글 삭제
              </span>
              <span
                  className={styles.changeText}
                  onClick={onChange}
                  role="button"
              >
                  게시글 수정
              </span>
              </div>
          )}
        </div>
        <div className={styles.meta}>
          <span className={styles.date}>{date}</span>

          <div className={styles.authorSection}>
            <div className={styles.commentCount}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
                  fill="#6B7280"
                />
              </svg>
              <span className={styles.count}>{commentCount}</span>
            </div>

            <span className={styles.author}>{author}</span>

            {post.mine || (
              <button
                type="button"
                aria-label="신고하기"
                className={styles.sirenButton}
                onClick={() => setIsReportModalOpen(true)}
                style={{ backgroundColor: "white" }}
              >
                <Image src="/siren.png" alt="신고" width={30} height={30} />
              </button>
            )}
            <ReportModal
              isOpen={isReportModalOpen}
              onClose={() => setIsReportModalOpen(false)}
              applicantName={author}
            />
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {paragraphs.length === 0 ? (
          <p className={styles.paragraphEmpty}>내용이 없습니다.</p>
        ) : (
          paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>
              {p}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
