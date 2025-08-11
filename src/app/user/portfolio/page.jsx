"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Portfolio.module.css";
import ActivityModal from "./ActivityModal";
import ActivityDetailModal from "./ActivityDetailModal";
import Image from "next/image";
import ActivityCardCarousel from "./ActivityCardCarousel";
import { useSearchParams } from "next/navigation";

const PortfolioPage = () => {
  const searchParams = useSearchParams();
  const petId = searchParams.get("petId");

  // 반려동물 데이터 (실제로는 API에서 가져올 데이터)
  const pets = [
    {
      id: 1,
      name: "황금이",
      breed: "골든 리트리버",
      age: "3살",
      health: "Healthy",
      description:
        "장난기 많고 에너지가 넘칩니다. 공놀이와 해변에서 수영하는 것을 좋아합니다.",
      image: "/user/dog.png",
      healthPercentage: 100,
      healthColor: "#8BC34A",
      isPetStar: true,
      gender: "수컷",
      sns: "instagram",
    },
    {
      id: 2,
      name: "루나",
      breed: "샴 고양이",
      age: "2살",
      health: "Healthy",
      description: "독립적이고 우아한 성격입니다.",
      image: "/user/cat.png",
      healthPercentage: 85,
      healthColor: "#F5A623",
      isPetStar: false,
      gender: "암컷",
      sns: "",
    },
    {
      id: 3,
      name: "찰리",
      breed: "푸른 마코 앵무",
      age: "5살",
      health: "건강 검진 예정",
      description: "수다스럽고 사교적인 성격입니다.",
      image: "/user/bird.png",
      healthPercentage: 60,
      healthColor: "#FF7675",
      isPetStar: false,
      gender: "수컷",
      sns: "",
    },
  ];

  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phoneNumber: "",
    petName: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    price: "",
    personality: "",
    introduction: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [activityCards, setActivityCards] = useState([
    {
      id: 1,
      image: "/campaign-1.jpg",
      images: [
        "/campaign-1.jpg",
        "/campaign-2.jpg",
        "/campaign-3.jpg",
        "/campaign-4.jpg",
      ],
      title: "펫샵 모델 활동",
      period: "2024.01.15 - 2024.02.15",
      content: "브랜드 홍보 촬영 및 SNS 콘텐츠 제작",
      detailedContent:
        "펫샵 브랜드의 모델로 활동하며, 다양한 제품 촬영과 SNS 콘텐츠 제작에 참여했습니다. 고객들과의 상호작용을 통해 브랜드 인지도를 높이는 데 기여했으며, 특히 소셜미디어에서 높은 반응을 얻었습니다.",
      progress: 100,
    },
    {
      id: 2,
      image: "/campaign-2.jpg",
      images: [
        "/campaign-2.jpg",
        "/campaign-3.jpg",
        "/campaign-4.jpg",
        "/campaign-1.jpg",
      ],
      title: "애견 카페 홍보",
      period: "2024.03.01 - 2024.04.01",
      content: "애견 카페 브랜드 홍보 및 이벤트 참여",
      detailedContent:
        "로컬 애견 카페의 브랜드 홍보 모델로 활동했습니다. 카페의 분위기와 서비스를 소개하는 사진 촬영에 참여했으며, 고객들과 함께하는 이벤트에도 참여하여 카페의 인지도 향상에 기여했습니다.",
      progress: 85,
    },
    {
      id: 3,
      image: "/campaign-3.jpg",
      images: [
        "/campaign-3.jpg",
        "/campaign-4.jpg",
        "/campaign-1.jpg",
        "/campaign-2.jpg",
      ],
      title: "펫 용품 브랜드 협찬",
      period: "2024.05.10 - 2024.06.10",
      content: "펫 용품 브랜드 제품 사용 후기 및 홍보",
      detailedContent:
        "프리미엄 펫 용품 브랜드와 협찬하여 제품 사용 후기를 작성하고 홍보 활동을 진행했습니다. 다양한 제품을 직접 사용해보고 솔직한 리뷰를 제공하여 소비자들의 신뢰를 얻었습니다.",
      progress: 92,
    },
    {
      id: 4,
      image: "/campaign-4.jpg",
      images: [
        "/campaign-4.jpg",
        "/campaign-1.jpg",
        "/campaign-2.jpg",
        "/campaign-3.jpg",
      ],
      title: "반려동물 행사 참여",
      period: "2024.07.20 - 2024.08.20",
      content: "반려동물 관련 행사 및 페스티벌 참여",
      detailedContent:
        "다양한 반려동물 관련 행사와 페스티벌에 참여하여 행사 홍보와 이벤트 진행을 도왔습니다. 많은 반려동물과 그 주인들과의 만남을 통해 즐거운 경험을 나누었습니다.",
      progress: 78,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showTempSaveModal, setShowTempSaveModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const fileInputRef = useRef(null);

  // petId가 있을 때 해당 반려동물의 정보를 포트폴리오에 불러오기
  useEffect(() => {
    if (petId) {
      const selectedPet = pets.find((pet) => pet.id === parseInt(petId));
      if (selectedPet) {
        setFormData((prev) => ({
          ...prev,
          petName: selectedPet.name,
          breed: selectedPet.breed,
          age: selectedPet.age,
          gender: selectedPet.gender === "수컷" ? "male" : "female",
          personality: selectedPet.description,
          introduction: selectedPet.description,
        }));
        setProfileImage(selectedPet.image);
      }
    }
  }, [petId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) previewImage(file);
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const addActivityCard = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setEditingActivity(null);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const handleCardClick = (card) => {
    setSelectedActivity(card);
    setIsDetailModalOpen(true);
  };

  const handleSaveActivity = (activityData) => {
    if (isEditMode && editingActivity) {
      // 수정 모드: 기존 활동이력 업데이트
      setActivityCards((prev) =>
        prev.map((card) =>
          card.id === editingActivity.id
            ? {
                ...card,
                image:
                  activityData.images && activityData.images.length > 0
                    ? activityData.images[0].preview
                    : card.image,
                title: activityData.title,
                period: activityData.period,
                content: activityData.content,
                detailedContent: activityData.detailedContent,
              }
            : card
        )
      );
    } else {
      // 새로 등록 모드: 새로운 활동이력 추가
      const newCard = {
        id: Date.now(),
        image:
          activityData.images && activityData.images.length > 0
            ? activityData.images[0].preview
            : "/campaign-1.jpg",
        title: activityData.title,
        period: activityData.period,
        content: activityData.content,
        detailedContent: activityData.detailedContent,
        progress: 100,
      };
      setActivityCards((prev) => [...prev, newCard]);
    }
  };

  const handleTempSave = () => {
    // 임시저장 모달 표시
    setShowTempSaveModal(true);

    // 2초 후 모달 자동 닫기
    setTimeout(() => {
      setShowTempSaveModal(false);
    }, 2000);
  };

  const handleSubmit = () => {
    // 필수 필드 검증
    const missingFields = [];

    if (!formData.petName.trim()) {
      missingFields.push("반려동물 이름");
    }
    if (!formData.breed.trim()) {
      missingFields.push("품종");
    }
    if (!formData.age.trim()) {
      missingFields.push("나이");
    }
    if (!formData.gender.trim()) {
      missingFields.push("성별");
    }
    if (!formData.personality.trim()) {
      missingFields.push("성격");
    }
    if (!formData.introduction.trim()) {
      missingFields.push("간단한 소개");
    }
    if (!formData.ownerName.trim()) {
      missingFields.push("이름");
    }
    if (!formData.email.trim()) {
      missingFields.push("이메일");
    }
    if (!formData.phoneNumber.trim()) {
      missingFields.push("연락처");
    }

    if (missingFields.length > 0) {
      // 작성되지 않은 내용이 있는 경우
      setValidationMessage(
        `${missingFields.join(", ")}이(가) 작성되지 않았습니다.`
      );
      setShowValidationModal(true);
      return;
    }

    // 모든 필드가 작성된 경우 확인 모달 표시
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    // 실제 등록 로직 구현
    console.log("포트폴리오 등록 완료:", formData);
    setShowConfirmModal(false);
    // 여기에 실제 API 호출 로직 추가
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <main className={styles.main}>
          <h1 className={styles.pageTitle}>포트폴리오 관리</h1>

          {/* 프로필 이미지 섹션 */}
          <section className={styles.profileImageSection}>
            <div className={styles.profileImageContainer}>
              <div className={styles.profileImage} onClick={triggerFileSelect}>
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="프로필 이미지"
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: "50%" }}
                  />
                ) : null}
              </div>
              {!profileImage && (
                <button
                  className={styles.profileUploadButton}
                  onClick={triggerFileSelect}
                >
                  프로필 이미지 업로드
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </section>

          {/* 활동이력 카드 섹션 */}
          <section className={styles.activitySection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>1</div>
              <h2 className={styles.sectionTitle}>활동이력 카드</h2>
              <button
                className={styles.addCardButton}
                onClick={addActivityCard}
              >
                +
              </button>
            </div>

            {/* ✅ 분리한 캐러셀 컴포넌트 사용 */}
            <ActivityCardCarousel
              activityCards={activityCards}
              onCardClick={handleCardClick}
              onEditActivity={handleEditActivity}
            />
          </section>

          {/* 성격 섹션 */}
          <section className={styles.personalitySection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>2</div>
              <h2 className={styles.sectionTitle}>성격</h2>
            </div>
            <div className={styles.sectionContent}>
              <textarea
                className={styles.personalityTextarea}
                placeholder="반려동물의 성격 및 활동 경력을 300자 이내로 작성해주세요."
                name="personality"
                value={formData.personality}
                onChange={handleInputChange}
                maxLength={300}
              ></textarea>
              <div className={styles.characterCount}>
                {formData.personality.length}/300
              </div>
            </div>
          </section>

          {/* 간단한 소개 섹션 */}
          <section className={styles.introductionSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>3</div>
              <h2 className={styles.sectionTitle}>간단한 소개</h2>
            </div>
            <div className={styles.sectionContent}>
              <textarea
                className={styles.introductionInput}
                placeholder="한줄 소개를 300자 이내로 작성해주세요."
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                maxLength={300}
                rows={3}
              />
              <div className={styles.characterCount}>
                {formData.introduction.length}/300
              </div>
            </div>
          </section>

          {/* 반려동물 정보 섹션 */}
          <section className={styles.petInfoSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>4</div>
              <h2 className={styles.sectionTitle}>반려동물 정보</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="breed">품종</label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    placeholder="품종을 입력해주세요"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="age">나이</label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="나이를 입력해주세요"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="weight">무게</label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="무게를 입력해주세요"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="gender">성별</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={styles.genderSelect}
                  >
                    <option value="">선택</option>
                    <option value="male">수컷</option>
                    <option value="female">암컷</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="price">단가</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="단가를 입력해주세요"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 연락 수단 섹션 */}
          <section className={styles.contactSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>5</div>
              <h2 className={styles.sectionTitle}>연락 수단</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="ownerName">이름</label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="이름을 입력해주세요"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력해주세요"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">연락처</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="연락처를 입력해주세요"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 버튼 섹션 */}
          <div className={styles.buttonSection}>
            <button className={styles.saveDraftButton} onClick={handleTempSave}>
              임시 저장
            </button>
            <button className={styles.submitButton} onClick={handleSubmit}>
              등록하기
            </button>
          </div>
        </main>
      </div>

      {/* 활동이력 추가 모달 */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
        isEditMode={isEditMode}
        editingData={editingActivity}
      />

      {/* 활동이력 상세 모달 */}
      <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        activityData={selectedActivity}
      />

      {/* 임시저장 완료 모달 */}
      {showTempSaveModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.alertModal}>
            <div className={styles.alertContent}>
              <div className={`${styles.alertIcon} ${styles.successIcon}`}>
                ✓
              </div>
              <h3 className={styles.alertTitle}>임시저장이 완료되었습니다.</h3>
            </div>
          </div>
        </div>
      )}

      {/* 검증 실패 모달 */}
      {showValidationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.alertModal}>
            <div className={styles.alertContent}>
              <div className={`${styles.alertIcon} ${styles.warningIcon}`}>
                ⚠
              </div>
              <h3 className={styles.alertTitle}>{validationMessage}</h3>
              <button
                className={styles.alertButton}
                onClick={() => setShowValidationModal(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 등록 확인 모달 */}
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.alertModal}>
            <div className={styles.alertContent}>
              <div className={`${styles.alertIcon} ${styles.questionIcon}`}>
                ?
              </div>
              <h3 className={styles.alertTitle}>등록하시겠습니까?</h3>
              <div className={styles.confirmButtons}>
                <button
                  className={styles.confirmButton}
                  onClick={handleConfirmSubmit}
                >
                  등록
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowConfirmModal(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
