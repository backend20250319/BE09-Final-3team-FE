"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getInstagramProfiles } from "../lib/feedData";
import styles from "../styles/feed/ProfileCard.module.css";

export default function ProfileSelector({
  onProfileSelect,
  selectedProfileId,
  selectedProfileUsername,
  allowNone = false, // 선택 안함 옵션 허용 여부
}) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const containerRef = useRef(null);

  // selectedProfileId가 있으면 해당 프로필을 찾아서 설정
  const currentProfile =
    selectedProfileId && selectedProfileId !== ""
      ? profiles.find((p) => String(p.id) === String(selectedProfileId)) ||
        selectedProfile
      : selectedProfile;

  // 표시할 username 결정 - 빈 문자열이거나 null인 경우 선택 안함으로 처리
  const displayUsername =
    selectedProfileUsername && selectedProfileUsername !== ""
      ? selectedProfileUsername
      : currentProfile?.username;

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

        // 기본값 설정: allowNone이 false면 첫 번째 프로필, true면 선택 안함
        if (!selectedProfile && !selectedProfileId && list.length > 0) {
          if (allowNone) {
            console.log("기본값으로 '선택 안함' 설정");
            setSelectedProfile(null);
          } else {
            console.log("첫 번째 프로필을 기본값으로 설정:", list[0]);
            setSelectedProfile(list[0]);
            // 부모 컴포넌트에 선택된 프로필 알림 - 전체 프로필 객체 전달
            if (onProfileSelect) {
              onProfileSelect(list[0]);
            }
          }
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
      const profile = profiles.find(
        (p) => String(p.id) === String(selectedProfileId)
      );
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
      // 전체 프로필 객체를 전달
      if (onProfileSelect) {
        onProfileSelect(chosen);
      }
    }
  };

  const handleProfileClick = (profile) => {
    console.log("프로필 클릭:", profile);
    setSelectedProfile(profile);
    setOpen(false);
    // 전체 프로필 객체를 전달
    if (onProfileSelect) {
      if (profile === null) {
        // "선택 안함"이 선택된 경우
        console.log("onProfileSelect 호출: 선택 안함");
        onProfileSelect(null);
      } else {
        console.log("onProfileSelect 호출:", profile);
        onProfileSelect(profile);
      }
    }
  };

  const calculateDropdownPosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const dropdownHeight = 300; // 대략적인 드롭다운 높이

    // 버튼 아래쪽에 드롭다운을 표시할 공간이 충분한지 확인
    if (rect.bottom + dropdownHeight > windowHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  };

  const handleToggleOpen = () => {
    if (!open) {
      calculateDropdownPosition();
    }
    console.log("드롭다운 토글:", !open, "위치:", dropdownPosition);
    setOpen((v) => !v);
  };

  return (
    <div
      ref={containerRef}
      className={styles.profileInfo}
      style={{
        margin: "8px 0 16px",
        position: "relative",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      <div className={styles.profileHeader}>
        <div style={{ position: "relative", width: 280, zIndex: 10 }}>
          <button
            type="button"
            className={`${styles.profileSelectorButton} ${
              open ? styles.active : ""
            }`}
            onClick={handleToggleOpen}
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
                <span style={{ fontWeight: 600 }}>@{displayUsername}</span>
                <span style={{ opacity: 0.9 }}> 프로필 선택 ▼</span>
              </>
            ) : loading ? (
              "프로필 로딩 중..."
            ) : profiles.length === 0 ? (
              "연결된 프로필이 없습니다"
            ) : (
              "프로필 선택 ▼"
            )}
          </button>
          {open && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                ...(dropdownPosition === "top"
                  ? {
                      bottom: "100%",
                      marginBottom: "4px",
                    }
                  : {
                      top: "100%",
                      marginTop: "4px",
                    }),
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 9999,
                minWidth: "280px",
              }}
            >
              {loading ? (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  프로필 로딩 중...
                </div>
              ) : error ? (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#ef4444",
                    fontSize: "14px",
                  }}
                >
                  프로필 로딩 실패: {error}
                </div>
              ) : profiles.length === 0 ? (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  사용 가능한 프로필이 없습니다.
                </div>
              ) : (
                <>
                  {console.log("프로필 목록 렌더링:", profiles)}
                  {/* "선택 안함" 옵션 - allowNone이 true일 때만 표시 */}
                  {allowNone && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f3f4f6",
                        backgroundColor:
                          selectedProfile === null ? "#eff6ff" : "transparent",
                        borderLeft:
                          selectedProfile === null
                            ? "3px solid #60a5fa"
                            : "none",
                      }}
                      onClick={() => handleProfileClick(null)}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor =
                          selectedProfile === null ? "#eff6ff" : "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          color: "#9ca3af",
                        }}
                      >
                        ✕
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#374151",
                            marginBottom: "2px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          선택 안함
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          SNS 프로필을 연결하지 않습니다
                        </div>
                      </div>
                    </div>
                  )}
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f3f4f6",
                        backgroundColor:
                          currentProfile?.id === profile.id
                            ? "#eff6ff"
                            : "transparent",
                        borderLeft:
                          currentProfile?.id === profile.id
                            ? "3px solid #60a5fa"
                            : "none",
                      }}
                      onClick={() => handleProfileClick(profile)}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor =
                          currentProfile?.id === profile.id
                            ? "#eff6ff"
                            : "transparent")
                      }
                    >
                      <Image
                        src={profile.profile_picture_url || "/user-1.jpg"}
                        alt={profile.name || profile.username}
                        width={40}
                        height={40}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#374151",
                            marginBottom: "2px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {profile.name || profile.username}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          @{profile.username}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
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
