import Image from "next/image";
import styles from "../styles/ProfileCard.module.css";

export default function ProfileCard() {
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileContent}>
        <div className={styles.avatarContainer}>
          <Image
            src="/images/profile-avatar.jpg"
            alt="Profile Avatar"
            width={80}
            height={80}
            className={styles.avatar}
          />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.username}>@golden_buddy_adventures</h2>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>245.2K</div>
              <div className={styles.statLabel}>Followers</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1,847</div>
              <div className={styles.statLabel}>Following</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>892</div>
              <div className={styles.statLabel}>Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
