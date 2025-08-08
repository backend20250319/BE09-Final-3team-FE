import ProfileCard from "./ProfileCard";
import styles from "../styles/ProfilePage.module.css";
import SubHeader from "@/app/components/SubHeader";

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <SubHeader
          title="프로필 관리"
          subtitle="광고주 프로필 정보 및 회사 정보를 관리하세요"
        />
        <ProfileCard />
      </main>
    </div>
  );
};

export default ProfilePage;
