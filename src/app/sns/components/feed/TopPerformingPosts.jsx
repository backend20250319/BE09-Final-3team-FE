"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/feed/TopPerformingPosts.module.css";
import { getTopPerformingPosts } from "../../lib/feedData";
import { useSns } from "../../context/SnsContext";
import { AiFillHeart, AiOutlineComment } from "react-icons/ai";

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
        {posts.map((post, index) => (
          <div key={post.id} className={styles.postCard}>
            <div className={`${styles.rankBadge} ${styles[`${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}`]}`}>
              {index + 1}
            </div>
            <div className={styles.imageContainer}>
              <Image src={post.image} alt={post.title} width={64} height={64} className={styles.postImage} />
            </div>
            <div className={styles.postContent}>
              <h4 className={styles.postTitle}>{post.title}</h4>
              <div className={styles.postStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{post.likes}</span>
                  <div className={styles.iconContainer}>
                    <AiFillHeart size={16} color="#EF4444" />
                  </div>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{post.comments}</span>
                  <div className={styles.iconContainer}>
                    <AiOutlineComment size={16} color="#3B82F6" />
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
