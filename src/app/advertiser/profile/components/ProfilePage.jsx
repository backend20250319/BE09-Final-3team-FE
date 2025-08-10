import ProfileCard from "./ProfileCard";
import styles from "../styles/ProfilePage.module.css";
import SubHeader from "@/app/components/SubHeader";

const ProfilePage = () => {
  return (
    <main className={styles.main}>
      <SubHeader
        title="프로필 관리"
        subtitle="기업 프로필을 간편하게 수정하고 항상 최신 정보로 관리하세요"
      />
      <ProfileCard />
    </main>
  );
};

export default ProfilePage;
