// app/components/NoticeCard.jsx
"use client";
import React from "react";
import styles from "../styles/NoticeCard.module.css";

function toCardModel(api) {
  return {
    id: api.id ?? api.postId,
    title: api.title ?? "",
    contentPreview: api.contentPreview ?? "",         // content 일부만 보여주고 싶으면 .slice(0,120)
    createdAt: api.createdAt,
    author: api.author
        ? {
          id: api.author.id ?? null,
          name: api.author.nickname ?? "익명",
          avatarUrl: api.author.profileImageUrl ?? null,
        }
        : null,
    commentCount: api.commentCount ?? api.comments ?? 0,
    thumbnailUrl: api.thumbnailUrl ?? null,
  };
}
function formatRelativeKo(value) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    let secs = Math.floor((Date.now() - d.getTime()) / 1000);
    if (secs < 0) secs = 0;

    if (secs < 5) return "방금 전";
    if (secs < 60) return `${secs}초 전`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}분 전`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}주 전`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}개월 전`;
    const years = Math.floor(days / 365);
    return `${years}년 전`;
}

export default function NoticeCard({ post }) {
  console.log("[NoticeCard] post =", post);
  const m = toCardModel(post);
  console.log("[NoticeCard] model =", m);

  return (
      <article className={styles.card}>
        <div className={styles.content}>
          <h3 className={styles.title}>{m.title}</h3>
          <p className={styles.description}>{m.contentPreview || "내용 없음"}</p>
          <div className={styles.footer}>
              <div className={styles.authorInfo}>
                  {m.author?.avatarUrl && (
                      <img
                          src={m.author.avatarUrl ?? "/user/avatar-placeholder.jpg"}
                          alt={m.author?.name ?? "작성자"}
                          className={styles.avatar}
                      />
                  )}
                  {m.author?.name && (                        // ✅ AuthorDto.name
                      <span className={styles.authorName}>{m.author.name}</span>
                  )}
                  {m.createdAt && (
                      <>
                          <span className={styles.separator}>•</span>
                          <span className={styles.time}>
        {formatRelativeKo(m.createdAt)}
      </span>
                      </>
                  )}
              </div>
            <div className={styles.likes}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                    d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
                    fill="#6B7280"
                />
              </svg>
              <span className={styles.commentCount}>{m.commentCount}</span>
            </div>
          </div>
        </div>
      </article>
  );
}
