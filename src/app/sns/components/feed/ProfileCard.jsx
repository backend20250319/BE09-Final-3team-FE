"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getProfileData, getInstagramProfiles } from "../../lib/feedData";
import { useSns } from "../../context/SnsContext";
import styles from "../../styles/feed/ProfileCard.module.css";

export default function ProfileCard() {
  const { selectedInstagramProfile, setSelectedInstagramProfile } = useSns();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [instagramProfiles, setInstagramProfiles] = useState([]);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [profilesError, setProfilesError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userNo = localStorage.getItem("userNo");
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

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileSelector && !event.target.closest(`.${styles.profileInfo}`)) {
        setShowProfileSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileSelector]);

  // 인스타그램 프로필 목록 가져오기
  const fetchInstagramProfiles = async () => {
    if (instagramProfiles.length > 0) return;
    
    setProfilesLoading(true);
    setProfilesError(null);
    
    try {
      console.log('Fetching Instagram profiles...');
      const profiles = await getInstagramProfiles();
      console.log('Received profiles:', profiles);
      
      setInstagramProfiles(profiles);
      // 첫 번째 프로필을 기본 선택
      if (profiles.length > 0 && !selectedInstagramProfile) {
        setSelectedInstagramProfile(profiles[0]);
      }
    } catch (error) {
      console.error("Failed to fetch Instagram profiles:", error);
      setProfilesError(error.message);
    } finally {
      setProfilesLoading(false);
    }
  };

  const handleProfileSelect = (profile) => {
    console.log('Profile selected:', profile);
    setSelectedInstagramProfile(profile);
    setShowProfileSelector(false);
  };

  const toggleProfileSelector = () => {
    console.log('Toggle profile selector, current state:', showProfileSelector);
    if (!showProfileSelector) {
      fetchInstagramProfiles();
    }
    setShowProfileSelector(!showProfileSelector);
  };

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
              {selectedInstagramProfile?.username || profileData.username}
            </h2>
            <button 
              className={`${styles.profileSelectorButton} ${showProfileSelector ? styles.active : ''}`}
              onClick={toggleProfileSelector}
            >
              프로필 선택 ▼
            </button>
          </div>
          
          {/* 프로필 선택 드롭다운 */}
          {showProfileSelector && (
            <div className={styles.profileSelector}>
              {profilesLoading ? (
                <div className={styles.loadingText}>프로필 로딩 중...</div>
              ) : profilesError ? (
                <div className={styles.errorText}>
                  <div>프로필 로딩 실패: {profilesError}</div>
                  <button 
                    onClick={fetchInstagramProfiles}
                    className={styles.retryButton}
                  >
                    다시 시도
                  </button>
                </div>
              ) : instagramProfiles.length === 0 ? (
                <div className={styles.emptyText}>사용 가능한 프로필이 없습니다.</div>
              ) : (
                <>
                  {instagramProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`${styles.profileOption} ${
                        selectedInstagramProfile?.id === profile.id ? styles.selected : ''
                      }`}
                      onClick={() => handleProfileSelect(profile)}
                    >
                      <Image
                        src={profile.profile_picture_url}
                        alt={profile.name}
                        width={40}
                        height={40}
                        className={styles.profileOptionAvatar}
                      />
                      <div className={styles.profileOptionInfo}>
                        <div className={styles.profileOptionName}>{profile.name}</div>
                        <div className={styles.profileOptionUsername}>@{profile.username}</div>
                      </div>
                      <div className={styles.profileOptionStats}>
                        <div className={styles.profileOptionFollowers}>
                          팔로워 {profile.followers_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {selectedInstagramProfile ? selectedInstagramProfile.followers_count.toLocaleString() : profileData.stats.followers}
              </div>
              <div className={styles.statLabel}>팔로워</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {selectedInstagramProfile ? selectedInstagramProfile.follows_count.toLocaleString() : profileData.stats.following}
              </div>
              <div className={styles.statLabel}>팔로잉</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {selectedInstagramProfile ? selectedInstagramProfile.media_count.toLocaleString() : profileData.stats.posts}
              </div>
              <div className={styles.statLabel}>게시물</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
