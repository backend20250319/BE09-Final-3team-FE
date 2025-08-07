"use client";
import React from "react";
import styles from "../styles/NoticeCard.module.css";

export default function NoticeCard({ post }) {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.description}>{post.description}</p>
        <div className={styles.footer}>
          <div className={styles.authorInfo}>
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className={styles.avatar}
            />
            <span className={styles.authorName}>{post.author.name}</span>
            <span className={styles.separator}>•</span>
            <span className={styles.time}>{post.time}</span>
          </div>
          <div className={styles.likes}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 12L6.5 11.5C3.5 8.5 1 6.5 1 4C1 2.5 2 1.5 3.5 1.5C4.5 1.5 5.5 2 6 3C6.5 2 7.5 1.5 8.5 1.5C10 1.5 11 2.5 11 4C11 6.5 8.5 8.5 5.5 11.5L7 12Z"
                fill="#6B7280"
              />
            </svg>
            <span className={styles.likeCount}>{post.likes}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
