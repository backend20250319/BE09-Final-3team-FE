"use client";
import styles from "@/app/admin/styles/ProductManagement.module.css";

import React, { useState, useEffect } from "react";
import {
  getReportList,
  approveReport,
  rejectReport,
  getAdvertiserApplications,
  approveAdvertiser,
  rejectAdvertiser,
} from "@/api/userApi";
import {
  getPetStarApplications,
  approvePetStar,
  rejectPetStar,
} from "@/api/petApi";
import PopupModal from "@/app/admin/components/PopupModal";
import AlertModal from "./AlertModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function MemberManagement() {
  const [activeTab, setActiveTab] = useState("펫스타 지원");
  const [reportList, setReportList] = useState([]);
  const [petStarList, setPetStarList] = useState([]);
  const [advertiserList, setAdvertiserList] = useState([]);

  // 페이지네이션을 위한 총 요소 수
  const [totalReportElements, setTotalReportElements] = useState(0);
  const [totalPetStarElements, setTotalPetStarElements] = useState(0);
  const [totalAdvertiserElements, setTotalAdvertiserElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedPetStar, setSelectedPetStar] = useState(null);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 파일 관련 상태 (더 이상 사용하지 않음)
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedAdvertiserFiles, setSelectedAdvertiserFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  // 필터링 상태
  const [sortBy, setSortBy] = useState("최신순");
  const [memberTypeFilter, setMemberTypeFilter] = useState("전체");

  // 페이지네이션 계산 함수들 (백엔드에서 이미 필터링된 데이터를 받으므로 단순화)
  const getCurrentItems = (items) => {
    return items; // 백엔드에서 이미 페이지네이션된 데이터를 받음
  };

  const getTotalPages = (totalElements) => {
    return Math.ceil(totalElements / itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 데이터 조회
  useEffect(() => {
    setCurrentPage(1); // 탭 변경 시 첫 페이지로 이동

    if (activeTab === "신고당한 회원") {
      loadReportList();
    } else if (activeTab === "펫스타 지원") {
      loadPetStarList();
    } else if (activeTab === "광고주 회원 승인") {
      loadAdvertiserList();
    }
  }, [activeTab]);

  // 필터링 변경 시 페이지 리셋 및 데이터 재조회
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, memberTypeFilter]);

  // 필터링 변경 시 데이터 재조회
  useEffect(() => {
    if (activeTab === "신고당한 회원") {
      loadReportList();
    } else if (activeTab === "펫스타 지원") {
      loadPetStarList();
    } else if (activeTab === "광고주 회원 승인") {
      loadAdvertiserList();
    }
  }, [sortBy, memberTypeFilter, currentPage]);

  const loadReportList = async () => {
    setLoading(true);
    try {
      console.log("신고 목록 조회 시작...");

      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        sort: sortBy === "최신순" ? "createdAt,desc" : "createdAt,asc",
        ...(memberTypeFilter !== "전체" && {
          targetType: memberTypeFilter === "광고주" ? "ADVERTISER" : "USER",
        }),
      };

      console.log("신고 목록 조회 파라미터:", params);
      const data = await getReportList(params);
      console.log("신고 목록 조회 성공:", data);
      setReportList(data?.content || []);
      setTotalReportElements(data?.totalElements || 0);
    } catch (error) {
      console.error("신고 목록 조회 실패:", error);
      console.error("에러 상세:", error.response?.data);
      setReportList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPetStarList = async () => {
    setLoading(true);
    try {
      const sortParam =
        sortBy === "최신순" ? "pendingAt,desc" : "pendingAt,asc";
      const data = await getPetStarApplications({
        page: currentPage - 1,
        size: itemsPerPage,
        sort: sortParam,
      });
      console.log("펫스타 데이터 구조:", data?.content);
      if (data?.content && data.content.length > 0) {
        console.log("첫 번째 펫스타 데이터:", data.content[0]);
        console.log("snsProfileUsername:", data.content[0]?.snsProfileUsername);
      }
      setPetStarList(data?.content || []);
      setTotalPetStarElements(data?.totalElements || 0);
    } catch (error) {
      console.error("펫스타 신청 목록 조회 실패:", error);
      console.error("에러 상세:", error.response?.data);
      setPetStarList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAdvertiserList = async () => {
    setLoading(true);
    try {
      console.log("광고주 신청 목록 조회 시작...");
      const data = await getAdvertiserApplications({
        page: currentPage - 1,
        size: itemsPerPage,
        sort: sortBy === "최신순" ? "createdAt,desc" : "createdAt,asc",
      });
      console.log("광고주 신청 목록 조회 성공:", data);
      console.log("광고주 목록 데이터 구조:", {
        data,
        content: data?.content,
        length: data?.content?.length,
        isArray: Array.isArray(data?.content),
      });

      // 각 광고주의 파일 정보 확인
      if (data?.content) {
        data.content.forEach((advertiser, index) => {
          console.log(`광고주 ${index + 1} 파일 정보:`, {
            advertiserNo: advertiser.advertiserNo,
            name: advertiser.name,
            profileImageUrl: advertiser.profileImageUrl,
            documentUrl: advertiser.documentUrl,
            profileOriginalName: advertiser.profileOriginalName,
            documentOriginalName: advertiser.documentOriginalName,
          });
        });
      }
      // 이제 백엔드에서 파일 정보가 포함된 데이터를 받으므로 별도 조회 불필요
      setAdvertiserList(data?.content || []);
      setTotalAdvertiserElements(data?.totalElements || 0);
      console.log("광고주 목록 조회 성공 (파일 정보 포함):", data?.content);
    } catch (error) {
      console.error("광고주 신청 목록 조회 실패:", error);
      console.error("에러 상세:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      console.error("에러 메시지:", error.message);
      setAdvertiserList([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = "info") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlertModal(true);
  };

  const showDeleteConfirm = (action, target, title, message) => {
    setDeleteAction(() => action);
    setDeleteTarget(target);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteAction && deleteTarget) {
      deleteAction(deleteTarget);
    }
    setShowDeleteModal(false);
    setDeleteAction(null);
    setDeleteTarget(null);
  };

  const handleRestrict = async (reportId) => {
    try {
      await approveReport(reportId);
      showAlert("사용자가 제한되었습니다.", "success");
      loadReportList(); // 목록 새로고침
    } catch (error) {
      console.error("제한 실패:", error);
      showAlert("제한 처리에 실패했습니다.", "error");
    }
  };

  const handleReject = async (reportId, reason) => {
    try {
      await rejectReport(reportId, reason);
      showAlert("신고가 거절되었습니다.", "success");
      loadReportList(); // 목록 새로고침
    } catch (error) {
      console.error("거절 실패:", error);
      showAlert("거절 처리에 실패했습니다.", "error");
    }
  };

  const handlePetStarApprove = async (petNo) => {
    try {
      await approvePetStar(petNo);
      showAlert("펫스타가 승인되었습니다.", "success");
      loadPetStarList(); // 목록 새로고침
    } catch (error) {
      console.error("펫스타 승인 실패:", error);
      showAlert("펫스타 승인에 실패했습니다.", "error");
    }
  };

  const handlePetStarReject = async (petNo, reason) => {
    try {
      await rejectPetStar(petNo, reason);
      showAlert("펫스타 신청이 거절되었습니다.", "success");
      loadPetStarList(); // 목록 새로고침
    } catch (error) {
      console.error("펫스타 거절 실패:", error);
      showAlert("펫스타 거절에 실패했습니다.", "error");
    }
  };

  const handleAdvertiserApprove = async (advertiserId) => {
    try {
      await approveAdvertiser(advertiserId);
      showAlert("광고주가 승인되었습니다.", "success");
      loadAdvertiserList(); // 목록 새로고침
    } catch (error) {
      console.error("광고주 승인 실패:", error);
      showAlert("광고주 승인에 실패했습니다.", "error");
    }
  };

  const handleAdvertiserReject = async (advertiserId, reason) => {
    try {
      await rejectAdvertiser(advertiserId, reason);
      showAlert("광고주 신청이 거절되었습니다.", "success");
      loadAdvertiserList(); // 목록 새로고침
    } catch (error) {
      console.error("광고주 거절 실패:", error);
      showAlert("광고주 거절에 실패했습니다.", "error");
    }
  };

  // 파일 모달 열기 함수 (이미 데이터가 있으므로 단순화)
  const loadAdvertiserFiles = (advertiser) => {
    console.log("파일 모달 열기:", advertiser);
    setSelectedAdvertiserFiles([advertiser]);
    setShowFileModal(true);
  };
  const handleApprove = () => {
    showDeleteConfirm(
      () => showAlert("승인되었습니다.", "success"),
      null,
      "승인 확인",
      "승인하시겠습니까?"
    );
  };

  return (
    <>
      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Navigation Tabs */}
          <div className={styles.tabNavigation}>
            <nav className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "펫스타 지원" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("펫스타 지원")}
              >
                펫스타 지원자 목록
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "신고당한 회원" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("신고당한 회원")}
              >
                신고당한 회원 목록
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "광고주 회원 승인" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("광고주 회원 승인")}
              >
                광고주 회원 신청 목록
              </button>
            </nav>
          </div>

          {/* Search and Filter */}
          <div className={styles.searchSection}>
            <div>
              {activeTab === "펫스타 지원" ? (
                <h2 className={styles.sectionTitle}>펫스타 지원자 목록</h2>
              ) : activeTab === "신고당한 회원" ? (
                <h2 className={styles.sectionTitle}>신고당한 회원 목록</h2>
              ) : (
                <h2 className={styles.sectionTitle}>광고주 회원 신청 목록</h2>
              )}
            </div>
            <div className={styles.rightControls}>
              {/* 신고당한 회원 탭에서만 회원 타입 필터 표시 */}
              {activeTab === "신고당한 회원" && (
                <select
                  className={styles.sortSelect}
                  value={memberTypeFilter}
                  onChange={(e) => setMemberTypeFilter(e.target.value)}
                >
                  <option value="전체">전체</option>
                  <option value="광고주">광고주</option>
                  <option value="일반회원">일반회원</option>
                </select>
              )}

              {/* 펫스타 지원과 광고주 회원 승인 탭에서만 정렬 필터 표시 */}
              {(activeTab === "펫스타 지원" ||
                activeTab === "광고주 회원 승인") && (
                <select
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="최신순">최신순</option>
                  <option value="오래된순">오래된순</option>
                </select>
              )}
            </div>
          </div>
          {/* Product List */}
          <section className={styles.productSection}>
            <div className={styles.productList}>
              {activeTab === "펫스타 지원" &&
                (loading ? (
                  <div>펫스타 신청 목록을 불러오는 중...</div>
                ) : petStarList.length === 0 ? (
                  <div>펫스타 신청이 없습니다.</div>
                ) : (
                  getCurrentItems(petStarList).map((petstar, index) => {
                    console.log("렌더링 중인 펫스타 데이터:", petstar);
                    console.log(
                      "snsProfileUsername:",
                      petstar?.snsProfileUsername
                    );
                    return (
                      <div
                        key={petstar.petNo || `petstar-${index}`}
                        className={styles.productCard}
                      >
                        <div className={styles.productContent}>
                          <div className={styles.productImage}>
                            <img
                              src={
                                petstar.petImageUrl || "/petstar/petstar1.jpeg"
                              }
                              alt={petstar.petName}
                              onError={(e) => {
                                e.currentTarget.src = "/petstar/petstar1.jpeg";
                              }}
                            />
                          </div>
                          <div className={styles.productInfo}>
                            <h3 className={styles.productTitle}>
                              {petstar.petName}
                            </h3>
                            <p className={styles.productDescription}>
                              {petstar.petType} | {petstar.age}세 |{" "}
                              {petstar.petGender}
                            </p>
                            {/* 임시 테스트용 - 실제 데이터가 없어도 표시 */}
                            <div className={styles.instagramLink}>
                              <a
                                href={`https://www.instagram.com/${
                                  petstar.snsProfileUsername || "test_username"
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                https://www.instagram.com/
                                {petstar.snsProfileUsername || "test_username"}
                              </a>
                            </div>
                            <div className={styles.companyInfo}>
                              <img
                                src={
                                  petstar.userProfileImageUrl ||
                                  "/owner/owner1.jpeg"
                                }
                                className={styles.companyLogo}
                                onError={(e) => {
                                  e.currentTarget.src = "/owner/owner1.jpeg";
                                }}
                              />
                              <div className={styles.companyDetails}>
                                <span className={styles.companyName}>
                                  {petstar.userName}
                                </span>
                                <span className={styles.companyType}>
                                  {petstar.userPhone} | {petstar.userEmail}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={styles.productActions}
                          style={{ width: "265px" }}
                        >
                          <button
                            className={styles.approveBtn}
                            onClick={() => {
                              showDeleteConfirm(
                                handlePetStarApprove,
                                petstar.petNo,
                                "펫스타 승인",
                                "이 펫스타를 승인하시겠습니까?"
                              );
                            }}
                          >
                            승인하기
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => {
                              setSelectedPetStar(petstar);
                              setIsModalOpen(true);
                            }}
                          >
                            거절하기
                          </button>
                          <PopupModal
                            isOpen={isModalOpen}
                            onClose={() => {
                              setIsModalOpen(false);
                              setSelectedPetStar(null);
                            }}
                            onDelete={(reason) => {
                              if (selectedPetStar) {
                                handlePetStarReject(
                                  selectedPetStar.petNo,
                                  reason
                                );
                              }
                              setIsModalOpen(false);
                              setSelectedPetStar(null);
                            }}
                            actionType="petstarreject"
                            targetKeyword={
                              selectedPetStar ? selectedPetStar.petName : ""
                            }
                          />
                        </div>
                      </div>
                    );
                  })
                ))}

              {activeTab === "신고당한 회원" &&
                (loading ? (
                  <div>신고 목록을 불러오는 중...</div>
                ) : reportList.length === 0 ? (
                  <div>신고된 회원이 없습니다.</div>
                ) : (
                  getCurrentItems(reportList).map((report, index) => (
                    <div
                      key={report.reportId || `report-${index}`}
                      className={styles.productCard}
                    >
                      <div className={styles.productContent}>
                        <div className={styles.productImage}>
                          <img
                            src={
                              report.targetProfileImage ||
                              "/user/avatar-placeholder.jpg"
                            }
                            alt="신고 대상"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/user/avatar-placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className={styles.productInfo}>
                          <div
                            className={styles.resonleft}
                            style={{ fontSize: "larger" }}
                          >
                            신고 대상: {report.targetNickname} (
                            {report.targetType}: {report.targetId})
                          </div>
                          <div className={styles.reasonleft}>
                            신고 사유: {report.reason}
                          </div>
                          <div
                            className={styles.reasonright}
                            style={{ fontSize: "larger" }}
                          >
                            신고자: {report.reporterNickname} (
                            {report.reporterType}: {report.reporterId})
                          </div>
                          <div className={styles.reasonleft}>
                            신고일:{" "}
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                          <div className={styles.reasonleft}>
                            상태: {report.status}
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.productActions}
                        style={{ width: "265px" }}
                      >
                        <button
                          className={styles.deleteBtn}
                          onClick={() => {
                            showDeleteConfirm(
                              handleRestrict,
                              report.reportId,
                              "제한",
                              "제한하시겠습니까?"
                            );
                          }}
                          disabled={report.status !== "BEFORE"}
                        >
                          제한하기
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => {
                            setSelectedReport(report);
                            setIsModalOpen(true);
                          }}
                          disabled={report.status !== "BEFORE"}
                        >
                          거절하기
                        </button>
                        <PopupModal
                          isOpen={isModalOpen}
                          onClose={() => {
                            setIsModalOpen(false);
                            setSelectedReport(null);
                          }}
                          onDelete={(reason) => {
                            if (selectedReport) {
                              handleReject(selectedReport.reportId, reason);
                            }
                            setIsModalOpen(false);
                            setSelectedReport(null);
                          }}
                          actionType="reportreject"
                          targetKeyword={
                            selectedReport ? selectedReport.reason : ""
                          }
                        />
                      </div>
                    </div>
                  ))
                ))}
              {activeTab === "광고주 회원 승인" && (
                <>
                  {console.log("광고주 탭 렌더링:", {
                    loading,
                    advertiserListLength: advertiserList.length,
                    advertiserList,
                    currentItems: getCurrentItems(advertiserList),
                  })}
                  {loading ? (
                    <div>광고주 신청 목록을 불러오는 중...</div>
                  ) : advertiserList.length === 0 ? (
                    <div>광고주 신청이 없습니다.</div>
                  ) : (
                    getCurrentItems(advertiserList).map((advertiser, index) => {
                      console.log(
                        `렌더링 중 - 광고주 ${advertiser.advertiserNo}:`,
                        {
                          advertiser,
                          profileImageUrl: advertiser.profileImageUrl,
                          documentUrl: advertiser.documentUrl,
                        }
                      );
                      return (
                        <div
                          key={advertiser.advertiserNo || `advertiser-${index}`}
                          className={styles.productCard}
                        >
                          <div
                            className={styles.productContent}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "20px",
                            }}
                          >
                            {/* 광고주 사진 - 왼쪽 */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "120px",
                                height: "100%",
                              }}
                            >
                              <h4
                                style={{
                                  margin: "0 0 8px 0",
                                  fontSize: "14px",
                                  color: "#666",
                                  textAlign: "center",
                                }}
                              >
                                광고주 사진
                              </h4>
                              {advertiser.profileImageUrl &&
                              advertiser.profileImageUrl !== "NO_FILE" ? (
                                <img
                                  src={advertiser.profileImageUrl}
                                  alt="광고주 프로필"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                    border: "3px solid #e9ecef",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/user/avatar-placeholder.jpg";
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "12px",
                                    backgroundColor: "#f8f9fa",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "3px solid #e9ecef",
                                    color: "#999",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                  }}
                                >
                                  {advertiser.profileImageUrl === "NO_FILE"
                                    ? "파일 없음"
                                    : "프로필 없음"}
                                </div>
                              )}
                            </div>

                            {/* 광고주 정보 영역 - 사진 오른쪽 */}
                            <div
                              className={styles.productInfo}
                              style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              <div
                                className={styles.resonleft}
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  marginBottom: "12px",
                                  color: "#333",
                                }}
                              >
                                {advertiser.name}
                              </div>

                              <div
                                className={styles.reasonleft}
                                style={{ marginBottom: "6px", color: "#666" }}
                              >
                                <strong>이메일:</strong>{" "}
                                {advertiser.email || "X"}
                              </div>

                              <div
                                className={styles.reasonleft}
                                style={{ marginBottom: "6px", color: "#666" }}
                              >
                                <strong>사업자 등록번호:</strong>{" "}
                                {advertiser.businessNumber}
                              </div>

                              <div
                                className={styles.reasonleft}
                                style={{ marginBottom: "6px", color: "#666" }}
                              >
                                <strong>전화번호:</strong> {advertiser.phone}
                              </div>

                              <div
                                className={styles.reasonleft}
                                style={{ marginBottom: "6px", color: "#666" }}
                              >
                                <strong>웹사이트:</strong>{" "}
                                {advertiser.website ? (
                                  <a
                                    href={
                                      advertiser.website.startsWith("http")
                                        ? advertiser.website
                                        : `https://${advertiser.website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      color: "#007bff",
                                      textDecoration: "underline",
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {advertiser.website}
                                  </a>
                                ) : (
                                  <span
                                    style={{
                                      color: "#999",
                                      marginLeft: "8px",
                                    }}
                                  >
                                    없음
                                  </span>
                                )}
                              </div>

                              {/* 파일 보기 버튼 - 웹사이트 아래에 배치 */}
                              <div
                                className={styles.reasonleft}
                                style={{ marginTop: "12px" }}
                              >
                                <button
                                  className={styles.fileBtn}
                                  onClick={() =>
                                    loadAdvertiserFiles(advertiser)
                                  }
                                  disabled={loadingFiles}
                                  style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    border: "1px solid #ddd",
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    width: "50%",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    transition: "all 0.2s",
                                  }}
                                  onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#f8f9fa";
                                    e.target.style.borderColor = "#adb5bd";
                                    e.target.style.transform =
                                      "translateY(-1px)";
                                  }}
                                  onMouseOut={(e) => {
                                    e.target.style.backgroundColor = "white";
                                    e.target.style.borderColor = "#ddd";
                                    e.target.style.transform = "translateY(0)";
                                  }}
                                >
                                  {loadingFiles ? "로딩중..." : "파일 보기"}
                                </button>
                              </div>

                              {advertiser.reason && (
                                <div
                                  className={styles.reasonleft}
                                  style={{
                                    color: "#dc3545",
                                    marginTop: "8px",
                                  }}
                                >
                                  <strong>거절 사유:</strong>{" "}
                                  {advertiser.reason}
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            className={styles.productActions}
                            style={{ width: "265px" }}
                          >
                            <button
                              className={styles.approveBtn}
                              onClick={() => {
                                showDeleteConfirm(
                                  handleAdvertiserApprove,
                                  advertiser.advertiserNo,
                                  "광고주 승인",
                                  "이 광고주를 승인하시겠습니까?"
                                );
                              }}
                            >
                              승인하기
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={() => {
                                setSelectedAdvertiser(advertiser);
                                setIsModalOpen(true);
                              }}
                            >
                              거절하기
                            </button>
                            <PopupModal
                              isOpen={isModalOpen}
                              onClose={() => {
                                setIsModalOpen(false);
                                setSelectedAdvertiser(null);
                              }}
                              onDelete={(reason) => {
                                if (selectedAdvertiser) {
                                  handleAdvertiserReject(
                                    selectedAdvertiser.advertiserNo,
                                    reason
                                  );
                                }
                                setIsModalOpen(false);
                                setSelectedAdvertiser(null);
                              }}
                              actionType="advertiserreject"
                              targetKeyword={
                                selectedAdvertiser
                                  ? selectedAdvertiser.name
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>
          </section>

          {/* 페이지네이션 */}
          {(() => {
            const totalElements =
              activeTab === "펫스타 지원"
                ? totalPetStarElements
                : activeTab === "신고당한 회원"
                ? totalReportElements
                : totalAdvertiserElements;

            return totalElements > itemsPerPage;
          })() && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                이전
              </button>

              {(() => {
                const totalElements =
                  activeTab === "펫스타 지원"
                    ? totalPetStarElements
                    : activeTab === "신고당한 회원"
                    ? totalReportElements
                    : totalAdvertiserElements;

                const totalPages = getTotalPages(totalElements);

                const pages = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(
                  1,
                  currentPage - Math.floor(maxVisiblePages / 2)
                );
                let endPage = Math.min(
                  totalPages,
                  startPage + maxVisiblePages - 1
                );

                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`${styles.paginationButton} ${
                        currentPage === i ? styles.active : ""
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                return pages;
              })()}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage ===
                  getTotalPages(
                    activeTab === "펫스타 지원"
                      ? totalPetStarElements
                      : activeTab === "신고당한 회원"
                      ? totalReportElements
                      : totalAdvertiserElements
                  )
                }
                className={styles.paginationButton}
              >
                다음
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 알림 모달 */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="알림"
        message={alertMessage}
        type={alertType}
        confirmText="확인"
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="확인"
        message="정말로 진행하시겠습니까?"
        confirmText="확인"
        cancelText="취소"
      />

      {/* 파일 모달 */}
      {showFileModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowFileModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFileModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h3 style={{ marginBottom: "20px" }}>업로드된 파일</h3>

            {selectedAdvertiserFiles.length === 0 ? (
              <p>업로드된 파일이 없습니다.</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {selectedAdvertiserFiles.map((advertiserWithFiles, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    {advertiserWithFiles.profileImageUrl &&
                      advertiserWithFiles.profileImageUrl !== "NO_FILE" && (
                        <>
                          <img
                            src={advertiserWithFiles.profileImageUrl}
                            alt="프로필 사진"
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #ddd",
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "/user/avatar-placeholder.jpg";
                            }}
                          />
                          <div>
                            <h4 style={{ margin: "0 0 5px 0" }}>프로필 사진</h4>
                            <p style={{ margin: 0, color: "#666" }}>
                              {advertiserWithFiles.profileOriginalName}
                            </p>
                          </div>
                        </>
                      )}

                    {advertiserWithFiles.documentUrl &&
                      advertiserWithFiles.documentUrl !== "NO_FILE" && (
                        <>
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "24px",
                            }}
                          >
                            📄
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 5px 0" }}>참고 문서</h4>
                            <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                              {advertiserWithFiles.documentOriginalName}
                            </p>
                            <a
                              href={advertiserWithFiles.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#007bff",
                                textDecoration: "underline",
                                fontSize: "14px",
                              }}
                            >
                              파일 다운로드
                            </a>
                          </div>
                        </>
                      )}

                    {/* 파일이 없는 경우 메시지 표시 */}
                    {(!advertiserWithFiles.profileImageUrl ||
                      advertiserWithFiles.profileImageUrl === "NO_FILE") &&
                      (!advertiserWithFiles.documentUrl ||
                        advertiserWithFiles.documentUrl === "NO_FILE") && (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#999",
                            padding: "20px",
                          }}
                        >
                          업로드된 파일이 없습니다.
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
