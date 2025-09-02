import styles from "../styles/PetProfileSelector.module.css";

export default function PetProfileSelector({
  pets,
  selectedPetName,
  onSelectPet,
  activeTab,
  onTabChange,
  loading = false,
}) {
  return (
    <div className={styles.petProfileSection} suppressHydrationWarning>
      <div className={styles.tabNavigation}>
        <div
          className={`${styles.tab} ${
            activeTab === "활동 관리" ? styles.active : ""
          }`}
          onClick={() => onTabChange && onTabChange("활동 관리")}
        >
          활동 관리
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "투약ㆍ돌봄 관리" ? styles.active : ""
          }`}
          onClick={() => onTabChange && onTabChange("투약ㆍ돌봄 관리")}
        >
          투약ㆍ돌봄 관리
        </div>
      </div>

      <h2 className={styles.sectionTitle}>반려동물 프로필</h2>
      <div className={styles.petProfiles}>
        {loading ? (
          <div className={styles.loadingMessage}>펫 목록을 불러오는 중...</div>
        ) : pets && pets.length > 0 ? (
          pets.map((pet, i) => {
            const petName = pet.name || `펫${i + 1}`;
            const isActive = petName === selectedPetName;
            return (
              <div
                key={i}
                className={`${styles.petCard} ${isActive ? styles.active : ""}`}
                onClick={() => onSelectPet(petName)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.petInfo}>
                  {pet.imageUrl ? (
                    <img
                      src={pet.imageUrl}
                      alt={petName}
                      className={styles.petAvatar}
                    />
                  ) : (
                    <div className={styles.petAvatarPlaceholder}>
                      <span>?</span>
                    </div>
                  )}
                  <div className={styles.petDetails}>
                    <h3>{petName}</h3>
                    <p>{pet.type || "반려동물"}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.noPetsMessage}>
            등록된 반려동물이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
