"use client";
import React from "react";
import PostDetail from "../components/PostDetail";
import styles from "../styles/detailPage.module.css";

export default function PostDetailPage({ params }) {
    const { postId } = React.use(params);

    return (
    <div className={styles.container}>
      <PostDetail postId={postId} />
    </div>
  );
}
