"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getProfileData } from "../../lib/feedData";
import styles from "../../styles/feed/ProfileCard.module.css";

export default function ProfileCard() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileData();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className={styles.profileCard}>Loading...</div>;
  }

  if (!profileData) {
    return <div className={styles.profileCard}>Error loading profile data</div>;
  }

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileContent}>
        <div className={styles.avatarContainer}>
          <Image
            src="/user-1.jpg"
            alt="Profile Avatar"
            width={80}
            height={80}
            className={styles.avatar}
          />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.username}>{profileData.username}</h2>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {profileData.stats.followers}
              </div>
              <div className={styles.statLabel}>팔로워</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {profileData.stats.following}
              </div>
              <div className={styles.statLabel}>팔로잉</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{profileData.stats.posts}</div>
              <div className={styles.statLabel}>게시물</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
