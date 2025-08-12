"use client";
import React, { useState } from "react";
import styles from "../styles/CommentForm.module.css";

export default function CommentForm({ onAddComment }) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>댓글 남기기</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <img
          src="/owner/owner1.jpeg"
          alt="User"
          className={styles.avatar}
        />
        <div className={styles.content}>
          <textarea
            className={styles.textarea}
            placeholder="댓글을 작성하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          <div className={styles.submit}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!comment.trim()}
            >
              댓글 작성
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
