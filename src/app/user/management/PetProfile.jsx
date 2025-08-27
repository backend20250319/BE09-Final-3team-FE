"use client";

import React, { useState, useEffect } from "react";
import styles from "./PetProfile.module.css";
import Image from "next/image";
import PetProfileRegistration from "./PetProfileRegistration";
import PetstarModal from "./PetstarModal";
import Link from "next/link";

const PET_API_BASE = "http://localhost:8000/api/v1/pet-service";

const PetProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPetstarModalOpen, setIsPetstarModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 반려동물 목록 조회
  const fetchPets = async () => {
    try {
      setLoading(true);

      // 로컬 스토리지에서 토큰과 사용자 정보 가져오기
      const token = localStorage.getItem("token");
      const userNo = localStorage.getItem("userNo");

      const response = await fetch(`${PET_API_BASE}/pets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(userNo && { "X-User-No": userNo }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "반려동물 목록 조회에 실패했습니다."
        );
      }

      const data = await response.json();
      setPets(data.data || []);
    } catch (error) {
      console.error("반려동물 목록 조회 실패:", error);
      setError(error.message);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 반려동물 목록 조회
  useEffect(() => {
    fetchPets();
  }, []);

  // 반려동물 삭제
  const handleDeletePet = async (petNo) => {
    try {
      const token = localStorage.getItem("token");
      const userNo = localStorage.getItem("userNo");

      const response = await fetch(`${PET_API_BASE}/pets/${petNo}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(userNo && { "X-User-No": userNo }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "반려동물 삭제에 실패했습니다.");
      }

      // 삭제 성공 시 목록 새로고침
      fetchPets();
      setIsDeleteModalOpen(false);
      showSuccessMessage("반려동물이 삭제되었습니다.");
    } catch (error) {
      console.error("반려동물 삭제 실패:", error);
      showSuccessMessage(error.message);
    }
  };

  // PetStar 신청
  const handleApplyPetStar = async (petNo) => {
    try {
      const token = localStorage.getItem("token");
      const userNo = localStorage.getItem("userNo");

      const response = await fetch(
        `${PET_API_BASE}/pets/${petNo}/petstar/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(userNo && { "X-User-No": userNo }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // 백엔드에서 전달된 구체적인 에러 메시지 사용
        const errorMessage =
          errorData.message || "PetStar 신청에 실패했습니다.";
        throw new Error(errorMessage);
      }

      // 신청 성공 시 목록 새로고침
      fetchPets();
      setIsPetstarModalOpen(false);
      showSuccessMessage("펫스타 신청이 완료되었습니다.");
    } catch (error) {
      console.error("PetStar 신청 실패:", error);
      // 실패 시 PetStar 신청 모달을 닫고 구체적인 실패 사유 표시
      setIsPetstarModalOpen(false);

      // 실패 사유에 따른 메시지 구분
      let failureMessage = "PetStar 신청에 실패했습니다.";

      if (error.message.includes("이미 PetStar 신청이 진행 중입니다")) {
        failureMessage =
          "이미 PetStar 신청이 진행 중입니다.\n\n신청 결과를 기다려주세요.";
      } else if (
        error.message.includes("이미 PetStar로 승인되어 활성화되었습니다")
      ) {
        failureMessage =
          "이미 PetStar로 승인되어 활성화되었습니다.\n\n다른 반려동물로 신청해보세요.";
      } else if (
        error.message.includes("이전에 PetStar 신청이 거절되었습니다")
      ) {
        failureMessage =
          "이전에 PetStar 신청이 거절되었습니다.\n\n다른 반려동물로 신청해보세요.";
      } else if (error.message.includes("권한이 없습니다")) {
        failureMessage =
          "PetStar 신청 권한이 없습니다.\n\n로그인 상태를 확인해주세요.";
      } else if (error.message.includes("반려동물을 찾을 수 없습니다")) {
        failureMessage =
          "반려동물 정보를 찾을 수 없습니다.\n\n반려동물 정보를 다시 확인해주세요.";
      } else if (error.message.includes("네트워크")) {
        failureMessage =
          "네트워크 연결을 확인해주세요.\n\n잠시 후 다시 시도해주세요.";
      } else {
        // 기타 에러는 백엔드에서 전달된 메시지 그대로 사용
        failureMessage = error.message;
      }

      showSuccessMessage(failureMessage);
    }
  };

  const hasPets = pets.length > 0;
  console.log("pets:", pets);
  console.log("hasPets:", hasPets);

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>반려동물 정보를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
          <p>오류: {error}</p>
          <button onClick={fetchPets}>다시 시도</button>
        </div>
      ) : !hasPets ? (
        <section className={styles.headerSectionEmpty}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>펫 프로필</h1>
            <h1 className={styles.mainTitle}>
              반려동물의 모든 정보를 한곳에 관리하세요
            </h1>
            <p className={styles.mainDescription}>
              사진, 건강 기록, 성격 특성 등 반려동물의 프로필을 자세히 작성하고
              정리할 수 있습니다. 필요한 모든 정보를 아름답고 체계적인 공간에서
              관리해보세요.
            </p>
            <button
              className={styles.createButton}
              onClick={() => setIsModalOpen(true)}
            >
              첫 번째 프로필 만들기
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className={styles.headerSection}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>펫 프로필</h1>
              <h1 className={styles.mainTitle}>
                반려동물의 모든 정보를 한곳에 관리하세요
              </h1>
              <p className={styles.mainDescription}>
                사진, 건강 기록, 성격 특성 등 반려동물의 프로필을 자세히
                작성하고 정리할 수 있습니다. 필요한 모든 정보를 아름답고
                체계적인 공간에서 관리해보세요.
              </p>
            </div>
          </section>

          <section className={styles.mainSection}>
            <div className={styles.contentWrapper}>
              <div className={styles.titleSection}>
                <h2 className={styles.sectionTitle}>반려동물 프로필</h2>
                <p className={styles.sectionDescription}>
                  반려동물의 모든 정보를 관리하고 확인하세요
                </p>
              </div>

              <div className={styles.petGrid}>
                {pets.map((pet) => (
                  <div key={pet.petNo} className={styles.petCard}>
                    <div className={styles.petImageContainer}>
                      <Link href={`/user/portfolio?petId=${pet.petNo}`}>
                        <div className={styles.petImage}>
                          <Image
                            src={
                              pet.imageUrl && !pet.imageUrl.startsWith("http")
                                ? pet.imageUrl
                                : "/user/dog.png"
                            }
                            alt={pet.name}
                            width={409}
                            height={192}
                            className={styles.petImage}
                          />
                        </div>
                      </Link>
                    </div>

                    <div className={styles.petInfo}>
                      <div className={styles.petHeader}>
                        <div className={styles.petNameBreedRow}>
                          <span className={styles.petName}>{pet.name}</span>
                          <span className={styles.breedText}>({pet.type})</span>
                          {pet.isPetStar && (
                            <Image
                              src="/user/medal.svg"
                              alt="PetStar"
                              width={20}
                              height={18}
                              className={styles.petStarBadge}
                            />
                          )}
                        </div>
                        <div className={styles.petMetaRow}></div>
                      </div>
                      <div className={styles.ageText}>{pet.age}살</div>
                      <div className={styles.genderText}>
                        {pet.gender === "M"
                          ? "수컷"
                          : pet.gender === "F"
                          ? "암컷"
                          : pet.gender}
                      </div>
                      <div className={styles.petDescription}>
                        {pet.description}
                      </div>
                      <div className={styles.petFooter}>
                        <div className={styles.petActions}>
                          {!pet.isPetStar && (
                            <button
                              className={styles.actionButton}
                              onClick={() => {
                                setSelectedPet(pet);
                                setIsPetstarModalOpen(true);
                              }}
                            >
                              <Image
                                src={`/user/medal.png`}
                                alt="Medal"
                                width={18}
                                height={18}
                              />
                            </button>
                          )}
                          <button
                            className={styles.actionButton}
                            onClick={() => handleEditPet(pet)}
                          >
                            <Image
                              src="/user/edit.png"
                              alt="Edit"
                              width={16}
                              height={16}
                            />
                          </button>
                          <button
                            className={styles.actionButton}
                            onClick={() => {
                              setSelectedPet(pet);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Image
                              src="/user/garbage.png"
                              alt="Delete"
                              width={14}
                              height={16}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className={styles.addPetCard}
                  onClick={() => setIsModalOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.addPetIcon}>
                    <Image
                      src="/user/plusVec.png"
                      alt="Add Pet"
                      width={23}
                      height={21}
                    />
                  </div>
                  <h3 className={styles.addPetTitle}>반려동물 등록하기</h3>
                  <p className={styles.addPetDescription}>
                    새로운 반려동물의 프로필을 등록해보세요!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 펫 프로필 등록 모달 */}
      <PetProfileRegistration
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        petData={selectedPet}
        isEditMode={!!selectedPet}
        onSuccess={fetchPets}
        onSuccessMessage={showSuccessMessage}
      />

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h1 className={styles.title}>삭제하시겠습니까?</h1>
              <button
                className={styles.closeButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div
              className={styles.modalFooter}
              style={{ display: "flex", justifyContent: "center", gap: "16px" }}
            >
              <button
                className={styles.deleteButton}
                onClick={() => {
                  if (selectedPet) {
                    handleDeletePet(selectedPet.petNo);
                  }
                }}
              >
                삭제
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 펫스타 신청 모달 */}
      <PetstarModal
        isOpen={isPetstarModalOpen}
        onClose={() => setIsPetstarModalOpen(false)}
        selectedPet={selectedPet}
        onApply={handleApplyPetStar}
      />

      {/* 성공 메시지 모달 */}
      {isSuccessModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h1 className={styles.modalTitle}>알림</h1>
              <button
                className={styles.modalClose}
                onClick={() => setIsSuccessModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalMessage}>{successMessage}</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButton}
                onClick={() => setIsSuccessModalOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetProfile;
