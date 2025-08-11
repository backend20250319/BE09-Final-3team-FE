"use client";
import React, { useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import styles from "../styles/CommentSection.module.css";
import commentData from "@/app/community/data/comments";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState(commentData);
  const handleAddComment = (newComment) => {
    const comment = {
      id: comments.length + 1,
      author: "@current_user",
      avatar: "/images/current-user.jpg",
      content: newComment,
      time: "방금 전",
    };
    setComments([comment, ...comments]);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>댓글</h2>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      <div className={styles.commentForm}>
        <CommentForm onAddComment={handleAddComment} />
      </div>
    </div>
  );
}
