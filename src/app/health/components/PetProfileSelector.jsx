import styles from "../activity/styles/Activity.module.css";

export default function PetProfileSelector() {
  return (
    <div className={styles.petProfileSection}>
      <div className={styles.tabNavigation}>
        <div className={`${styles.tab} ${styles.active}`}>활동 관리</div>
        <div className={styles.tab}>진료ㆍ처방 관리</div>
      </div>
      <h2 className={styles.sectionTitle}>반려동물 프로필</h2>
      <div className={styles.petProfiles}>
        {[
          {
            name: "Buddy",
            msg: "안녕하세요",
            src: "/images/buddy-profile.png",
            active: true,
          },
          { name: "Luna", msg: "반갑습니다", src: "/images/luna-profile.png" },
          { name: "Max", msg: "환영해요", src: "/images/max-profile.png" },
        ].map((pet, i) => (
          <div
            key={i}
            className={`${styles.petCard} ${pet.active ? styles.active : ""}`}
          >
            <div className={styles.petInfo}>
              <img src={pet.src} alt={pet.name} className={styles.petAvatar} />
              <div className={styles.petDetails}>
                <h3>{pet.name}</h3>
                <p>{pet.msg}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
