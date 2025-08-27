"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Portfolio.module.css";
import ActivityModal from "./ActivityModal";
import ActivityDetailModal from "./ActivityDetailModal";
import Image from "next/image";
import ActivityCardCarousel from "./ActivityCardCarousel";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const PortfolioContent = () => {
  const searchParams = useSearchParams();
  const petNo = searchParams.get("petId"); // URL 파라미터는 petId로 유지하되, 내부적으로는 petNo로 사용

  // API 기본 URL
  const PET_API_BASE = "http://localhost:8000/api/v1/pet-service";
  const PORTFOLIO_API_BASE = "http://localhost:8000/api/v1/pet-service";

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
  const [activityCards, setActivityCards] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showTempSaveModal, setShowTempSaveModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [hasPortfolio, setHasPortfolio] = useState(false);

  // API 호출 함수들
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");
    const userNo = localStorage.getItem("userNo");

    console.log("Auth Headers Debug:", {
      token: token ? "exists" : "missing",
      accessToken: accessToken ? "exists" : "missing",
      userNo: userNo ? "exists" : "missing",
    });

    // 단순화된 헤더
    const headers = {
      "Content-Type": "application/json",
    };

    // 토큰이 있으면 추가
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // 사용자 번호가 있으면 추가
    if (userNo) {
      headers["X-User-No"] = userNo;
    }

    return headers;
  };

  // 반려동물 정보 조회
  const fetchPetInfo = async (petNo) => {
    try {
      const response = await axios.get(`${PET_API_BASE}/pets/${petNo}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error("반려동물 정보 조회 실패:", error);
      throw error;
    }
  };

  // 포트폴리오 조회
  const fetchPortfolio = async (petNo) => {
    try {
      const response = await axios.get(
        `${PORTFOLIO_API_BASE}/pets/${petNo}/portfolio`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      // 404 또는 400 에러는 포트폴리오가 없는 경우이므로 정상적인 상황
      if (error.response?.status === 404 || error.response?.status === 400) {
        console.log("포트폴리오가 존재하지 않습니다.");
        return null;
      }
      console.error("포트폴리오 조회 실패:", error);
      throw error;
    }
  };

  // 포트폴리오 임시 저장
  const savePortfolioDraft = async (portfolioData) => {
    try {
      console.log(
        "임시저장할 포트폴리오 데이터:",
        JSON.stringify(portfolioData, null, 2)
      );
      console.log(
        "사용할 인증 헤더:",
        JSON.stringify(getAuthHeaders(), null, 2)
      );
      console.log("요청 URL:", `${PORTFOLIO_API_BASE}/pets/${petNo}/portfolio`);
      console.log("petNo:", petNo);

      // 먼저 간단한 GET 요청으로 API가 작동하는지 테스트
      try {
        const testResponse = await axios.get(
          `${PORTFOLIO_API_BASE}/pets/${petNo}`,
          {
            headers: getAuthHeaders(),
          }
        );
        console.log("반려동물 정보 조회 테스트 성공:", testResponse.data);
      } catch (testError) {
        console.error(
          "반려동물 정보 조회 테스트 실패:",
          testError.response?.status
        );
      }

      const response = await axios.post(
        `${PORTFOLIO_API_BASE}/pets/${petNo}/portfolio`,
        portfolioData,
        {
          headers: getAuthHeaders(),
        }
      );
      console.log("포트폴리오 임시저장 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("포트폴리오 임시 저장 실패:", error);
      console.error("에러 응답 데이터:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      console.error("에러 헤더:", error.response?.headers);
      console.error("에러 요청 데이터:", error.config?.data);
      console.error("에러 요청 URL:", error.config?.url);
      console.error("에러 요청 메서드:", error.config?.method);
      throw error;
    }
  };

  // 포트폴리오 등록
  const submitPortfolio = async (portfolioData) => {
    try {
      console.log(
        "전송할 포트폴리오 데이터:",
        JSON.stringify(portfolioData, null, 2)
      );
      console.log(
        "사용할 인증 헤더:",
        JSON.stringify(getAuthHeaders(), null, 2)
      );
      console.log("요청 URL:", `${PORTFOLIO_API_BASE}/pets/${petNo}/portfolio`);
      console.log("petNo:", petNo);

      const response = await axios.post(
        `${PORTFOLIO_API_BASE}/pets/${petNo}/portfolio`,
        portfolioData,
        {
          headers: getAuthHeaders(),
        }
      );
      console.log("포트폴리오 등록 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("포트폴리오 등록 실패:", error);
      console.error("에러 응답 데이터:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      console.error("에러 헤더:", error.response?.headers);
      console.error("에러 요청 데이터:", error.config?.data);
      console.error("에러 요청 URL:", error.config?.url);
      console.error("에러 요청 메서드:", error.config?.method);
      throw error;
    }
  };

  // 활동 이력 등록
  const createHistory = async (historyData) => {
    try {
      console.log(
        "활동 이력 등록 요청 데이터:",
        JSON.stringify(historyData, null, 2)
      );
      console.log(
        "활동 이력 등록 URL:",
        `${PET_API_BASE}/pets/${petNo}/histories`
      );
      console.log(
        "활동 이력 등록 헤더:",
        JSON.stringify(getAuthHeaders(), null, 2)
      );

      // 먼저 GET 요청으로 API가 작동하는지 테스트
      try {
        const testResponse = await axios.get(
          `${PET_API_BASE}/pets/${petNo}/histories`,
          {
            headers: getAuthHeaders(),
          }
        );
        console.log("활동 이력 조회 테스트 성공:", testResponse.data);
      } catch (testError) {
        console.error(
          "활동 이력 조회 테스트 실패:",
          testError.response?.status
        );
      }

      const response = await axios.post(
        `${PET_API_BASE}/pets/${petNo}/histories`,
        historyData,
        {
          headers: getAuthHeaders(),
        }
      );
      console.log("활동 이력 등록 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("활동 이력 등록 실패:", error);
      console.error("활동 이력 등록 실패 상세:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  };

  // 활동 이력 조회
  const fetchHistories = async (petNo) => {
    try {
      const response = await axios.get(
        `${PET_API_BASE}/pets/${petNo}/histories`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("활동 이력 조회 실패:", error);
      throw error;
    }
  };

  // 사용자 정보 조회
  const fetchUserInfo = async () => {
    try {
      // 먼저 localStorage에서 사용자 정보 확인
      const userNickname = localStorage.getItem("userNickname");
      const userEmail = localStorage.getItem("userEmail");
      const accessToken = localStorage.getItem("accessToken");
      const token = localStorage.getItem("token");

      // 토큰이 있고 기본 정보가 있으면 API 호출 시도
      if ((accessToken || token) && (userNickname || userEmail)) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/user-service/auth/profile`,
            {
              headers: getAuthHeaders(),
            }
          );
          return response.data.data;
        } catch (apiError) {
          console.log("API 호출 실패, localStorage 정보 사용");
          // API 실패 시 localStorage 정보 반환
          return {
            nickname: userNickname,
            name: userNickname,
            email: userEmail,
            phoneNumber: "",
            phone: "",
          };
        }
      } else {
        console.log("토큰 또는 사용자 정보가 없습니다.");
        return null;
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      return null;
    }
  };

  const fileInputRef = useRef(null);

  // petNo가 있을 때 해당 반려동물의 정보를 포트폴리오에 불러오기
  useEffect(() => {
    const loadData = async () => {
      if (petNo) {
        try {
          // 반려동물 정보 조회
          const petInfo = await fetchPetInfo(petNo);

          // 폼 데이터에 반려동물 정보 설정
          setFormData((prev) => ({
            ...prev,
            petName: petInfo.name || "",
            breed: petInfo.type || "",
            age: petInfo.age ? `${petInfo.age}살` : "",
            weight: petInfo.weight ? `${petInfo.weight}kg` : "",
            gender:
              petInfo.gender === "M"
                ? "male"
                : petInfo.gender === "F"
                ? "female"
                : "",
          }));

          // 프로필 이미지 설정
          if (petInfo.imageUrl) {
            setProfileImage(petInfo.imageUrl);
          }

          // 포트폴리오 정보 조회 (있는 경우)
          try {
            const portfolioInfo = await fetchPortfolio(petNo);
            if (portfolioInfo) {
              setHasPortfolio(true);
              setFormData((prev) => ({
                ...prev,
                introduction: portfolioInfo.content || "",
                personality: portfolioInfo.personality || "",
                price: portfolioInfo.cost ? portfolioInfo.cost.toString() : "",
              }));

              // 연락처 정보 파싱
              if (portfolioInfo.contact) {
                const contactParts = portfolioInfo.contact.split(", ");
                if (contactParts.length >= 3) {
                  setFormData((prev) => ({
                    ...prev,
                    ownerName: contactParts[0] || "",
                    email: contactParts[1] || "",
                    phoneNumber: contactParts[2] || "",
                  }));
                }
              }
            } else {
              // 포트폴리오가 없는 경우
              console.log("포트폴리오 정보가 없습니다.");
              setHasPortfolio(false);
            }
          } catch (portfolioError) {
            // 포트폴리오 조회 실패 시 포트폴리오가 없는 것으로 처리
            console.log("포트폴리오 조회 실패, 새로 작성 모드로 진행합니다.");
            setHasPortfolio(false);
          }

          // 사용자 정보 조회하여 연락수단 자동 설정
          const userInfo = await fetchUserInfo();
          if (userInfo) {
            setFormData((prev) => ({
              ...prev,
              ownerName: userInfo.nickname || userInfo.name || "",
              email: userInfo.email || "",
              phoneNumber: userInfo.phoneNumber || userInfo.phone || "",
            }));
          }

          // 활동 이력 조회 (별도 API)
          try {
            const histories = await fetchHistories(petNo);
            if (histories && histories.length > 0) {
              const activityCardsData = histories.map((history, index) => ({
                id: history.historyNo || index + 1,
                image: `/campaign-${(index % 4) + 1}.jpg`,
                images: [
                  `/campaign-${(index % 4) + 1}.jpg`,
                  `/campaign-${((index + 1) % 4) + 1}.jpg`,
                  `/campaign-${((index + 2) % 4) + 1}.jpg`,
                  `/campaign-${((index + 3) % 4) + 1}.jpg`,
                ],
                title: `활동 ${index + 1}`,
                period: `${history.historyStart} - ${history.historyEnd}`,
                content: history.content,
                detailedContent: history.content,
                progress: 100,
              }));
              setActivityCards(activityCardsData);
            }
          } catch (historyError) {
            // 활동 이력이 없는 경우 무시
            console.log("활동 이력 정보가 없습니다.");
          }
        } catch (error) {
          console.error("데이터 로드 실패:", error);
          // 에러 발생 시 빈 폼으로 유지
        }
      }
    };

    loadData();
  }, [petNo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 전화번호 필드인 경우 자동 포맷팅
    if (name === "phoneNumber") {
      const phoneNumber = value.replace(/[^0-9]/g, ""); // 숫자만 추출
      let formattedNumber = "";

      if (phoneNumber.length <= 3) {
        formattedNumber = phoneNumber;
      } else if (phoneNumber.length <= 7) {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else if (phoneNumber.length <= 11) {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
          3,
          7
        )}-${phoneNumber.slice(7)}`;
      } else {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
          3,
          7
        )}-${phoneNumber.slice(7, 11)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedNumber,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleTempSave = async () => {
    try {
      // 포트폴리오 데이터 준비 (백엔드 API 구조에 맞춤)
      const portfolioData = {
        content: formData.introduction || "",
        cost: formData.price ? parseInt(formData.price) : 0,
        contact: `${formData.ownerName}, ${formData.email}, ${formData.phoneNumber}`,
        isSaved: true,
        personality: formData.personality || "",
      };

      // 데이터 검증 및 정리
      if (!portfolioData.content || !portfolioData.personality) {
        throw new Error("필수 필드가 누락되었습니다.");
      }

      console.log("임시저장 데이터:", portfolioData);

      // 포트폴리오 임시저장
      console.log("포트폴리오 임시저장 시작");
      await savePortfolioDraft(portfolioData);
      console.log("포트폴리오 임시저장 완료");

      // 임시저장 모달 표시
      setShowTempSaveModal(true);

      // 2초 후 모달 자동 닫기
      setTimeout(() => {
        setShowTempSaveModal(false);
      }, 2000);
    } catch (error) {
      console.error("임시저장 실패:", error);
      console.error("에러 상세 정보:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
      });

      let errorMessage = "임시저장에 실패했습니다. 다시 시도해주세요.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요.";
      } else if (error.response?.status === 401) {
        errorMessage = "인증이 필요합니다. 다시 로그인해주세요.";
      } else if (error.response?.status === 500) {
        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }

      setValidationMessage(errorMessage);
      setShowValidationModal(true);
    }
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

  const handleConfirmSubmit = async () => {
    try {
      // 포트폴리오 데이터 준비 (백엔드 API 구조에 맞춤)
      const portfolioData = {
        content: formData.introduction || "",
        cost: formData.price ? parseInt(formData.price) : 0,
        contact: `${formData.ownerName}, ${formData.email}, ${formData.phoneNumber}`,
        isSaved: false,
        personality: formData.personality || "",
      };

      // 데이터 검증 및 정리
      if (!portfolioData.content || !portfolioData.personality) {
        throw new Error("필수 필드가 누락되었습니다.");
      }

      console.log("포트폴리오 데이터:", portfolioData);

      // 포트폴리오 저장
      console.log("포트폴리오 저장 시작");
      await submitPortfolio(portfolioData);
      console.log("포트폴리오 저장 완료");

      // 활동 이력들도 저장
      if (activityCards.length > 0) {
        console.log("활동 이력 저장 시작:", activityCards.length, "개");
        console.log(
          "활동 카드 데이터:",
          JSON.stringify(activityCards, null, 2)
        );

        for (const activity of activityCards) {
          console.log("처리 중인 활동:", activity);

          // 기간 데이터 검증 (하이픈 또는 물결표 모두 지원)
          if (
            !activity.period ||
            (!activity.period.includes(" - ") &&
              !activity.period.includes(" ~ "))
          ) {
            console.error("활동 기간 형식 오류:", activity.period);
            continue;
          }

          // 하이픈 또는 물결표로 분리
          const [startDate, endDate] = activity.period.includes(" - ")
            ? activity.period.split(" - ")
            : activity.period.split(" ~ ");
          const historyData = {
            historyStart: startDate,
            historyEnd: endDate,
            content: activity.content || "",
          };

          console.log("변환된 활동 이력 데이터:", historyData);

          try {
            await createHistory(historyData);
            console.log("활동 이력 저장 성공:", activity.title);
          } catch (historyError) {
            console.error("활동 이력 저장 실패:", activity.title, historyError);
            console.error("실패한 활동 데이터:", activity);
            console.error("실패한 이력 데이터:", historyData);
            // 개별 활동 이력 저장 실패는 전체 프로세스를 중단하지 않음
          }
        }
      } else {
        console.log("저장할 활동 이력이 없습니다.");
      }

      console.log("포트폴리오 등록 완료:", formData);
      setShowConfirmModal(false);

      // 성공 메시지 표시
      setValidationMessage("포트폴리오가 성공적으로 등록되었습니다.");
      setShowValidationModal(true);
    } catch (error) {
      console.error("포트폴리오 등록 실패:", error);
      console.error("에러 상세 정보:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
      });

      let errorMessage = "포트폴리오 등록에 실패했습니다. 다시 시도해주세요.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요.";
      } else if (error.response?.status === 401) {
        errorMessage = "인증이 필요합니다. 다시 로그인해주세요.";
      } else if (error.response?.status === 500) {
        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }

      setValidationMessage(errorMessage);
      setShowValidationModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <main className={styles.main}>
          <h1 className={styles.pageTitle}>포트폴리오 관리</h1>

          {/* 포트폴리오가 없는 경우 안내 메시지 */}
          {!hasPortfolio && (
            <div className={styles.portfolioPrompt}>
              <p className={styles.portfolioMessage}>
                사랑하는 반려동물과 겪은 일들을 작성하고 사람들한테 매력적이게
                나타내보세요!
              </p>
            </div>
          )}

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
                    placeholder="010-1234-5678"
                    maxLength={13}
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

export default PortfolioContent;
