"use client";
import Image from "next/image";
import { useSns } from "../../context/SnsContext";
import styles from "../../styles/feed/ProfileCard.module.css";

export default function ProfileCard() {
  const { selectedInstagramProfile } = useSns();

  if (!selectedInstagramProfile || !selectedInstagramProfile.id) {
    return (
      <div className={styles.profileCard}>
        <div className={styles.profileContent}>
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
          >
            인스타그램 프로필을 선택해주세요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileContent}>
        <div className={styles.avatarContainer}>
          <Image
            src={selectedInstagramProfile?.profile_picture_url || "/user-1.jpg"}
            alt="Profile Avatar"
            width={80}
            height={80}
            className={styles.avatar}
          />
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileHeader}>
            <h2 className={styles.username}>
              {selectedInstagramProfile?.username || "Unknown User"}
            </h2>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {selectedInstagramProfile?.followers_count || 0}
              </div>
              <div className={styles.statLabel}>팔로워</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {selectedInstagramProfile?.follows_count || 0}
              </div>
              <div className={styles.statLabel}>팔로잉</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {(selectedInstagramProfile?.media_count || 0).toLocaleString()}
              </div>
              <div className={styles.statLabel}>게시물</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
