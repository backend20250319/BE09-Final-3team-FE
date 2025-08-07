"use client";
import React from "react";
import PostContent from "./PostContent";
import CommentSection from "./CommentSection";
import styles from "../styles/PostDetail.module.css";
import posts from "../data/posts";

export default function PostDetail({ postId }) {
  // 실제 posts 데이터에서 해당 postId를 찾기
  const postData = posts.find((post) => post.id === parseInt(postId));

  // 실제 데이터가 있으면 사용하고, 없으면 기본 데이터 사용
  const post = postData
    ? {
        id: postData.id,
        title: postData.title,
        author: postData.author.name,
        date: postData.time,
        commentCount: postData.likes, // likes를 댓글 수로 사용
        content: [
          postData.description,
          "이 게시글에 대한 더 자세한 내용을 확인하세요.",
          "다른 사용자들의 의견과 경험을 공유해보세요.",
        ],
      }
    : {
        id: postId,
        title: "Tips for Creating Engaging Pet Content on Social Media",
        author: "@petlover_sarah",
        date: "Posted on March 15, 2024",
        commentCount: 24,
        content: [
          "Creating engaging content for your pet's social media presence requires understanding what your audience loves to see. Here are some proven strategies that have helped many pet influencers grow their following:",
          "1. Capture Authentic Moments",
          "The best pet content comes from genuine, unscripted moments. Whether it's your dog's excited reaction to treats or your cat's curious exploration of a new toy, these authentic moments resonate with viewers.",
          "2. Use Natural Lighting",
          "Good lighting can make or break your pet photos. Natural light from windows or outdoor settings creates the most flattering and professional-looking content.",
          "3. Tell a Story",
          "Every post should tell a story about your pet's personality, adventures, or daily life. This creates an emotional connection with your audience and keeps them coming back for more.",
        ],
      };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.backButton}>
          <button
            onClick={() => window.history.back()}
            className={styles.backBtn}
          >
            ← 목록으로 돌아가기
          </button>
        </div>

        <article className={styles.postCard}>
          <PostContent post={post} />
        </article>

        <section className={styles.commentSection}>
          <CommentSection postId={postId} />
        </section>
      </main>
    </div>
  );
}
