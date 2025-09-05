import styles from "../styles/PetProfileSelector.module.css";

export default function PetProfileSelector({
  pets,
  selectedPetName,
  onSelectPet,
  activeTab,
  onTabChange,
}) {
  return (
    <div className={styles.petProfileSection}>
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
            activeTab === "진료ㆍ처방 관리" ? styles.active : ""
          }`}
          onClick={() => onTabChange && onTabChange("진료ㆍ처방 관리")}
        >
          진료ㆍ처방 관리
        </div>
      </div>

      <h2 className={styles.sectionTitle}>반려동물 프로필</h2>
      <div className={styles.petProfiles}>
        {pets.map((pet, i) => {
          const isActive = pet.name === selectedPetName;
          return (
            <div
              key={i}
              className={`${styles.petCard} ${isActive ? styles.active : ""}`}
              onClick={() => onSelectPet(pet.name)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.petInfo}>
                <img
                  src={pet.src}
                  alt={pet.name}
                  className={styles.petAvatar}
                />
                <div className={styles.petDetails}>
                  <h3>{pet.name}</h3>
                  <p>{pet.msg}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
