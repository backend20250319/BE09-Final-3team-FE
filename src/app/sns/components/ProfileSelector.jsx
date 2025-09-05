"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSns } from "../context/SnsContext";
import { getInstagramProfiles } from "../lib/feedData";
import styles from "../styles/feed/ProfileCard.module.css";

export default function ProfileSelector() {
  const { selectedInstagramProfile, setSelectedInstagramProfile } = useSns();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const data = await getInstagramProfiles();
        const list = data?.data || [];
        setProfiles(list);
        if (!selectedInstagramProfile && list.length > 0) {
          setSelectedInstagramProfile(list[0]);
        }
      } catch (err) {
        setError(err?.message || "프로필을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [selectedInstagramProfile, setSelectedInstagramProfile]);

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
    if (chosen) setSelectedInstagramProfile(chosen);
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
            {selectedInstagramProfile?.username ? (
              <>
                <span style={{ fontWeight: 600 }}>
                  @{selectedInstagramProfile.username}
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
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`${styles.profileOption} ${
                        selectedInstagramProfile?.id === profile.id
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedInstagramProfile(profile);
                        setOpen(false);
                      }}
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
