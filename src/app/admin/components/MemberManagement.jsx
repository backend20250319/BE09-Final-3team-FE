"use client";
import styles from "@/app/admin/styles/ProductManagement.module.css";

import React, { useState, useEffect } from "react";
import { getReportList, approveReport, rejectReport } from "@/api/userApi";
import {
  getPetStarApplications,
  approvePetStar,
  rejectPetStar,
} from "@/api/petApi";
import {
  getAdvertiserApplications,
  approveAdvertiser,
  rejectAdvertiser,
} from "@/api/advertiserApi";
import PopupModal from "@/app/admin/components/PopupModal";
import AlertModal from "./AlertModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function MemberManagement() {
  const [activeTab, setActiveTab] = useState("펫스타 지원");
  const [reportList, setReportList] = useState([]);
  const [petStarList, setPetStarList] = useState([]);
  const [advertiserList, setAdvertiserList] = useState([]);
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

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  // 페이지네이션 계산 함수들
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => {
    return Math.ceil(items.length / itemsPerPage);
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

  const loadReportList = async () => {
    setLoading(true);
    try {
      console.log("신고 목록 조회 시작...");
      const data = await getReportList({ page: 0, size: 20 });
      console.log("신고 목록 조회 성공:", data);
      setReportList(data?.content || []);
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
      console.log("펫스타 신청 목록 조회 시작...");
      const data = await getPetStarApplications({ page: 0, size: 20 });
      console.log("펫스타 신청 목록 조회 성공:", data);
      setPetStarList(data?.content || []);
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
      const data = await getAdvertiserApplications({ page: 0, size: 20 });
      console.log("광고주 신청 목록 조회 성공:", data);
      setAdvertiserList(data?.content || []);
    } catch (error) {
      console.error("광고주 신청 목록 조회 실패:", error);
      console.error("에러 상세:", error.response?.data);
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
      await rejectPetStar(petNo);
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
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="검색어를 입력하세요."
                  className={styles.searchInput}
                />
                <div className={styles.searchIcon}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M11 11L15 15"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="7"
                      cy="7"
                      r="6"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              {activeTab === "펫스타 지원" ? (
                <select className={styles.sortSelect}>
                  <option>최신순</option>
                  <option>오래된순</option>
                </select>
              ) : (
                <select className={styles.sortSelect}>
                  <option>광고주</option>
                  <option>일반회원</option>
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
                  getCurrentItems(petStarList).map((petstar, index) => (
                    <div
                      key={petstar.petNo || `petstar-${index}`}
                      className={styles.productCard}
                    >
                      <div className={styles.productContent}>
                        <div className={styles.productImage}>
                          <img
                            src={petstar.imageUrl || "/petstar/petstar1.jpeg"}
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
                          <div className={styles.companyInfo}>
                            <img
                              src="/owner/owner1.jpeg"
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
                  ))
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
              {activeTab === "광고주 회원 승인" &&
                getCurrentItems(advertiserList).map((advertiser, index) => (
                  <div
                    key={advertiser.advertiserNo || `advertiser-${index}`}
                    className={styles.productCard}
                  >
                    <div className={styles.productContent}>
                      <div className={styles.productInfo}>
                        <div
                          className={styles.resonleft}
                          style={{ fontSize: "larger" }}
                        >
                          광고주 이메일 : {advertiser.email}
                        </div>
                        <div className={styles.reasonleft}>
                          전화번호 : {advertiser.phone}
                        </div>
                        <div
                          className={styles.reasonleft}
                          style={{ fontSize: "larger" }}
                        >
                          기업 이름 : {advertiser.name}
                        </div>
                        <div className={styles.reasonleft}>
                          사업자 등록 번호 : {advertiser.businessNumber}
                        </div>
                        <div className={styles.reasonleft}>
                          웹사이트 :{" "}
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
                              }}
                            >
                              {advertiser.website}
                            </a>
                          ) : (
                            "없음"
                          )}
                        </div>
                        {advertiser.reason && (
                          <div className={styles.reasonleft}>
                            거절 사유 : {advertiser.reason}
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
                        반려하기
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
                          selectedAdvertiser ? selectedAdvertiser.email : ""
                        }
                      />
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* 페이지네이션 */}
          {((activeTab === "펫스타 지원" &&
            petStarList.length > itemsPerPage) ||
            (activeTab === "신고당한 회원" &&
              reportList.length > itemsPerPage) ||
            (activeTab === "광고주 회원 승인" &&
              advertiserList.length > itemsPerPage)) && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                이전
              </button>

              {(() => {
                const totalPages = getTotalPages(
                  activeTab === "펫스타 지원"
                    ? petStarList
                    : activeTab === "신고당한 회원"
                    ? reportList
                    : advertiserList
                );

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
                      ? petStarList
                      : activeTab === "신고당한 회원"
                      ? reportList
                      : advertiserList
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
    </>
  );
}
