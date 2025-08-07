"use client";
import React, { useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import styles from "../styles/CommentSection.module.css";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "@dogmom_jenny",
      avatar: "/images/user1.jpg",
      content:
        "Great tips! I especially love the advice about natural lighting. My golden retriever Max looks so much better in photos when we shoot by the window.",
      time: "2시간 전",
    },
    {
      id: 2,
      author: "@catdad_mike",
      avatar: "/images/user2.jpg",
      content:
        "This is exactly what I needed! My cat Luna is so photogenic but I've been struggling with getting good shots. The storytelling tip is brilliant - I never thought about that aspect.",
      time: "4시간 전",
    },
    {
      id: 3,
      author: "@petinfluencer_alex",
      avatar: "/images/user3.jpg",
      content:
        "As someone who's been doing pet content for 2 years, I can confirm these tips work! Would love to add that consistency in posting is also key to growing your audience.",
      time: "6시간 전",
    },
  ]);

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
