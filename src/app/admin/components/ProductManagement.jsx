"use client";
import styles from "@/app/admin/styles/ProductManagement.module.css";
import PopupModal from "@/app/admin/components/PopupModal";
import AlertModal from "./AlertModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ApproveConfirmModal from "./ApproveConfirmModal";
import React, { useState, useEffect } from "react";
import {
  getAllCampaigns,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  deleteCampaign,
} from "@/api/userApi";

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("조회");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveAction, setApproveAction] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  // 필터링 상태
  const [sortBy, setSortBy] = useState("최신순");

  // 페이지네이션을 위한 총 요소 수
  const [totalElements, setTotalElements] = useState(0);

  // 캠페인 목록 조회
  const loadCampaigns = async () => {
    setLoading(true);
    try {
      console.log("캠페인 목록 조회 시작...", "activeTab:", activeTab);
      let data;
      if (activeTab === "조회") {
        // PENDING 상태의 캠페인만 조회
        console.log("PENDING 상태 캠페인 조회 API 호출");
        data = await getPendingCampaigns({
          page: currentPage - 1,
          size: itemsPerPage,
          sort: sortBy === "최신순" ? "createdAt,desc" : "createdAt,asc",
        });
      } else {
        // TRIAL 상태의 캠페인 조회
        console.log("TRIAL 상태 캠페인 조회 API 호출");
        data = await getAllCampaigns({
          page: currentPage - 1,
          size: itemsPerPage,
          sort: sortBy === "최신순" ? "createdAt,desc" : "createdAt,asc",
        });
      }
      console.log("캠페인 목록 조회 성공:", data);
      console.log("캠페인 개수:", data?.content?.length || 0);
      setCampaigns(data?.content || []);
      setTotalElements(data?.totalElements || 0);
    } catch (error) {
      console.error("캠페인 목록 조회 실패:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 및 탭/페이지 변경 시 데이터 로드
  useEffect(() => {
    loadCampaigns();
  }, [currentPage, activeTab]);

  // 필터링 변경 시 페이지 리셋 및 데이터 재조회
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // 필터링 변경 시 데이터 재조회
  useEffect(() => {
    loadCampaigns();
  }, [sortBy, currentPage]);

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

  const showApproveConfirm = (action, target, title, message) => {
    setApproveAction(() => action);
    setApproveTarget(target);
    setShowApproveModal(true);
  };

  const handleApproveConfirm = () => {
    if (approveAction && approveTarget) {
      approveAction(approveTarget);
    }
    setShowApproveModal(false);
    setApproveAction(null);
    setApproveTarget(null);
  };

  const handleDelete = async (adId) => {
    try {
      await deleteCampaign(adId);
      showAlert("캠페인이 삭제되었습니다.", "success");
      loadCampaigns(); // 목록 새로고침
    } catch (error) {
      console.error("캠페인 삭제 실패:", error);
      showAlert("캠페인 삭제에 실패했습니다.", "error");
    }
  };

  const handleReject = async (adId, reason) => {
    try {
      await rejectCampaign(adId, reason);
      showAlert("캠페인이 거절되었습니다.", "success");
      loadCampaigns(); // 목록 새로고침
    } catch (error) {
      console.error("캠페인 거절 실패:", error);
      showAlert("캠페인 거절에 실패했습니다.", "error");
    }
  };

  const handleApprove = async (adId) => {
    try {
      await approveCampaign(adId);
      showAlert("캠페인이 승인되었습니다.", "success");
      loadCampaigns(); // 목록 새로고침
    } catch (error) {
      console.error("캠페인 승인 실패:", error);
      showAlert("캠페인 승인에 실패했습니다.", "error");
    }
  };

  // 페이지네이션 함수들 (백엔드에서 이미 필터링된 데이터를 받으므로 단순화)
  const getCurrentItems = () => {
    return campaigns; // 백엔드에서 이미 페이지네이션된 데이터를 받음
  };

  const getTotalPages = () => {
    return Math.ceil(totalElements / itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                  activeTab === "조회" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("조회")}
              >
                상품 조회
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "승인" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("승인")}
              >
                상품 승인/반려
              </button>
            </nav>
          </div>

          {/* Search and Filter */}
          <div className={styles.searchSection}>
            <div>
              {activeTab === "조회" ? (
                <h2 className={styles.sectionTitle}>상품 조회</h2>
              ) : (
                <h2 className={styles.sectionTitle}>상품 승인/반려</h2>
              )}
            </div>
            <div className={styles.rightControls}>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="최신순">최신순</option>
                <option value="오래된순">오래된순</option>
              </select>
            </div>
          </div>

          {/* Product List */}
          <section className={styles.productSection}>
            <div className={styles.productList}>
              {loading ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : (
                getCurrentItems().map((campaign) => (
                  <div key={campaign.adNo} className={styles.productCard}>
                    <div className={styles.productContent}>
                      <div className={styles.productImage}>
                        <img
                          src={campaign.imageUrl || "/campaign.png"}
                          alt={campaign.title}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>
                          {campaign.title}
                        </h3>
                        <p className={styles.productDescription}>
                          {campaign.description}
                        </p>
                        <div className={styles.companyInfo}>
                          <img
                            src={campaign.advertiserLogo || "/brand-logo.jpg"}
                            alt={campaign.advertiserName}
                            className={styles.companyLogo}
                          />
                          <div className={styles.companyDetails}>
                            <span className={styles.companyName}>
                              {campaign.advertiserName}
                            </span>
                            <span className={styles.companyType}>
                              {campaign.advertiserWebsite ? (
                                <a
                                  href={
                                    campaign.advertiserWebsite.startsWith(
                                      "http"
                                    )
                                      ? campaign.advertiserWebsite
                                      : `https://${campaign.advertiserWebsite}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#007bff",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {campaign.advertiserWebsite}
                                </a>
                              ) : (
                                "웹사이트 없음"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={styles.productActions}
                      style={{ width: "265px" }}
                    >
                      {activeTab === "조회" ? (
                        <>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setIsModalOpen(true);
                            }}
                          >
                            <svg
                              width="12"
                              height="16"
                              viewBox="0 0 12 16"
                              fill="none"
                            >
                              <path
                                d="M1 3H11M4 3V2C4 1.44772 4.44772 1 5 1H7C7.55228 1 8 1.44772 8 2V3M9.5 3V13C9.5 14.1046 8.60457 15 7.5 15H4.5C3.39543 15 2.5 14.1046 2.5 13V3H9.5Z"
                                stroke="white"
                                strokeWidth="2"
                              />
                            </svg>
                            삭제하기
                          </button>
                          <PopupModal
                            isOpen={isModalOpen}
                            onClose={() => {
                              setIsModalOpen(false);
                              setSelectedCampaign(null);
                            }}
                            onDelete={() => {
                              if (selectedCampaign) {
                                handleDelete(selectedCampaign.adNo);
                              }
                              setIsModalOpen(false);
                              setSelectedCampaign(null);
                            }}
                            actionType="delete"
                            targetKeyword={
                              selectedCampaign ? selectedCampaign.title : ""
                            }
                          />
                        </>
                      ) : (
                        <>
                          <button
                            className={styles.approveBtn}
                            onClick={() => {
                              showApproveConfirm(
                                handleApprove,
                                campaign.adNo,
                                "캠페인 승인",
                                "이 캠페인을 승인하시겠습니까?"
                              );
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 8L6 12L14 4"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            승인하기
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setIsModalOpen(true);
                            }}
                          >
                            <svg
                              width="11"
                              height="10"
                              viewBox="0 0 11 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.6598 1.70664C11.0504 1.31602 11.0504 0.681641 10.6598 0.291016C10.2691 -0.0996094 9.63477 -0.0996094 9.24414 0.291016L5.95352 3.58477L2.65977 0.294141C2.26914 -0.0964844 1.63477 -0.0964844 1.24414 0.294141C0.853516 0.684766 0.853516 1.31914 1.24414 1.70977L4.53789 5.00039L1.24727 8.29414C0.856641 8.68476 0.856641 9.31914 1.24727 9.70977C1.63789 10.1004 2.27227 10.1004 2.66289 9.70977L5.95352 6.41602L9.24727 9.70664C9.63789 10.0973 10.2723 10.0973 10.6629 9.70664C11.0535 9.31602 11.0535 8.68164 10.6629 8.29102L7.36914 5.00039L10.6598 1.70664Z"
                                fill="white"
                              />
                            </svg>
                            거절하기
                          </button>
                          <PopupModal
                            isOpen={isModalOpen}
                            onClose={() => {
                              setIsModalOpen(false);
                              setSelectedCampaign(null);
                            }}
                            onDelete={(reason) => {
                              if (selectedCampaign) {
                                handleReject(selectedCampaign.adNo, reason);
                              }
                              setIsModalOpen(false);
                              setSelectedCampaign(null);
                            }}
                            actionType="productreject"
                            targetKeyword={
                              selectedCampaign ? selectedCampaign.title : ""
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 페이지네이션 */}
          {totalElements > itemsPerPage && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                이전
              </button>

              {(() => {
                const totalPages = getTotalPages();
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
                        i === currentPage ? styles.active : ""
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
                disabled={currentPage === getTotalPages()}
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

      {/* 승인 확인 모달 */}
      <ApproveConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={() => {
          if (approveAction && approveTarget) {
            approveAction(approveTarget);
          }
          setShowApproveModal(false);
          setApproveAction(null);
          setApproveTarget(null);
        }}
        title="승인 확인"
        message="정말로 승인하시겠습니까?"
        confirmText="승인"
        cancelText="취소"
      />
    </>
  );
}
