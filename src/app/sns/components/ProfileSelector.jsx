"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getInstagramProfiles } from "../lib/feedData";
import styles from "../styles/feed/ProfileCard.module.css";

export default function ProfileSelector({ onProfileSelect, selectedProfileId, selectedProfileUsername }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const containerRef = useRef(null);
  
  // selectedProfileId가 있으면 해당 프로필을 찾아서 설정
  const currentProfile = selectedProfileId 
    ? profiles.find(p => String(p.id) === String(selectedProfileId)) || selectedProfile
    : selectedProfile;
  
  // 표시할 username 결정
  const displayUsername = selectedProfileUsername || currentProfile?.username;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        console.log("프로필 데이터를 가져오는 중...");
        const data = await getInstagramProfiles();
        console.log("받은 데이터:", data);
        const list = data?.data || [];
        console.log("프로필 목록:", list);
        setProfiles(list);
        if (!selectedProfile && list.length > 0) {
          console.log("첫 번째 프로필 선택:", list[0]);
          setSelectedProfile(list[0]);
        }
      } catch (err) {
        console.error("프로필 로딩 오류:", err);
        setError(err?.message || "프로필을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // selectedProfileId가 변경될 때 해당 프로필을 선택
  useEffect(() => {
    if (selectedProfileId && profiles.length > 0) {
      const profile = profiles.find(p => String(p.id) === String(selectedProfileId));
      if (profile && profile.id !== selectedProfile?.id) {
        console.log("selectedProfileId로 프로필 선택:", profile);
        setSelectedProfile(profile);
      }
    }
  }, [selectedProfileId, profiles]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleChange = (e) => {
    const chosenId = e.target.value;
    const chosen = profiles.find((p) => String(p.id) === String(chosenId));
    if (chosen) {
      setSelectedProfile(chosen);
      // snsId와 username을 함께 전달
      if (onProfileSelect) {
        onProfileSelect({ snsId: chosen.id, username: chosen.username });
      }
    }
  };

  const handleProfileClick = (profile) => {
    console.log("프로필 클릭:", profile);
    setSelectedProfile(profile);
    setOpen(false);
    // snsId와 username을 함께 전달
    if (onProfileSelect) {
      console.log("onProfileSelect 호출:", { snsId: profile.id, username: profile.username });
      onProfileSelect({ snsId: profile.id, username: profile.username });
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.profileInfo}
      style={{ margin: "8px 0 16px" }}
    >
      <div className={styles.profileHeader}>
        <div style={{ position: "relative", width: 280 }}>
          <button
            type="button"
            className={`${styles.profileSelectorButton} ${
              open ? styles.active : ""
            }`}
            onClick={() => setOpen((v) => !v)}
            disabled={loading || !!error || profiles.length === 0}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Image
              src="/user/instagram.svg"
              alt="instagram"
              width={16}
              height={16}
            />
            {displayUsername ? (
              <>
                <span style={{ fontWeight: 600 }}>
                  @{displayUsername}
                </span>
                <span style={{ opacity: 0.9 }}> 프로필 선택 ▼</span>
              </>
            ) : (
              "프로필 선택 ▼"
            )}
          </button>
          {open && (
            <div
              className={styles.profileSelector}
              style={{ left: 0, right: 0 }}
            >
              {loading ? (
                <div className={styles.loadingText}>프로필 로딩 중...</div>
              ) : error ? (
                <div className={styles.errorText}>
                  프로필 로딩 실패: {error}
                </div>
              ) : profiles.length === 0 ? (
                <div className={styles.emptyText}>
                  사용 가능한 프로필이 없습니다.
                </div>
              ) : (
                <>
                  {console.log("프로필 목록 렌더링:", profiles)}
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`${styles.profileOption} ${
                        currentProfile?.id === profile.id
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleProfileClick(profile)}
                    >
                      <Image
                        src={profile.profile_picture_url || "/user-1.jpg"}
                        alt={profile.name || profile.username}
                        width={40}
                        height={40}
                        className={styles.profileOptionAvatar}
                      />
                      <div className={styles.profileOptionInfo}>
                        <div className={styles.profileOptionName}>
                          {profile.name || profile.username}
                        </div>
                        <div className={styles.profileOptionUsername}>
                          @{profile.username}
                        </div>
                      </div>
                      <div className={styles.profileOptionStats}>
                        <div className={styles.profileOptionFollowers}>
                          팔로워 {profile.followers_count || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
