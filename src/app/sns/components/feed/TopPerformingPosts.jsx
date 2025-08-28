"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/feed/TopPerformingPosts.module.css";
import { getTopPerformingPosts } from "../../lib/feedData";
import { useSns } from "../../context/SnsContext";

export default function TopPerformingPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedInstagramProfile } = useSns();

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        if (!selectedInstagramProfile?.id) {
          setPosts([]);
          return;
        }
        const data = await getTopPerformingPosts(selectedInstagramProfile.id);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsData();
  }, [selectedInstagramProfile]);

  if (loading) {
    return <div className={styles.topPostsCard}>Loading...</div>;
  }

  return (
    <div className={styles.topPostsCard}>
      <h3 className={styles.title}>최다 좋아요 수 게시물</h3>
      <div className={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.imageContainer}>
              <Image src={post.image} alt={post.title} width={64} height={64} className={styles.postImage} />
            </div>
            <div className={styles.postContent}>
              <h4 className={styles.postTitle}>{post.title}</h4>
              <div className={styles.postStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{post.likes}</span>
                  <div className={styles.iconContainer}>
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
                      <path
                        d="M10.42 1.58C10.0292 1.18918 9.5612 0.878159 9.04484 0.665537C8.52849 0.452915 7.97315 0.343262 7.412 0.343262C6.85085 0.343262 6.29551 0.452915 5.77916 0.665537C5.2628 0.878159 4.79479 1.18918 4.404 1.58L3.6 2.384L2.796 1.58C2.00631 0.790313 0.950731 0.343567 -0.144 0.343567C-1.23873 0.343567 -2.29431 0.790313 -3.084 1.58C-3.87369 2.36969 -4.32043 3.42527 -4.32043 4.52C-4.32043 5.61473 -3.87369 6.67031 -3.084 7.46L-2.28 8.264L3.6 14.144L9.48 8.264L10.284 7.46C10.6748 7.06921 10.9858 6.6012 11.1985 6.08485C11.4111 5.56849 11.5207 5.01315 11.5207 4.452C11.5207 3.89085 11.4111 3.33551 11.1985 2.81916C10.9858 2.3028 10.6748 1.83479 10.284 1.444L10.42 1.58Z"
                        fill="#EF4444"
                      />
                    </svg>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{post.comments}</span>
                  <div className={styles.iconContainer}>
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
                      <path
                        d="M10.5 5.75C10.5017 6.59 10.3475 7.42 10.05 8.2C9.6972 9.1059 9.1549 9.8996 8.4837 10.5146C7.8125 11.1297 7.0391 11.5497 6.25 11.75C5.59 11.9025 4.89 11.9983 4.2 12L1.5 13.5L2.45 10.65C2.15247 9.86095 2.00328 9.01595 2.0 8.1C2.0003 7.2609 2.2203 6.4375 2.63536 5.7129C3.05042 4.9883 3.64412 4.3853 4.35 3.95C4.89 3.6525 5.59 3.4983 6.25 3.5H6.75C8.0422 3.55749 9.2765 4.0474 10.2645 4.8854C11.2526 5.7235 11.9425 6.8578 12 8.15V8.6L10.5 5.75Z"
                        fill="#3B82F6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
