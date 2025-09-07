"use client";

import { useState, useCallback } from "react";

export function useMedicalModal() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 모달 상태 관리
  const openAddModal = useCallback(() => setShowAddModal(true), []);
  const closeAddModal = useCallback(() => setShowAddModal(false), []);
  
  const openEditModal = useCallback(() => setShowEditModal(true), []);
  const closeEditModal = useCallback(() => setShowEditModal(false), []);
  
  const openDetailModal = useCallback(() => setShowDetailModal(true), []);
  const closeDetailModal = useCallback(() => setShowDetailModal(false), []);
  
  const openConfirmModal = useCallback(() => setShowConfirm(true), []);
  const closeConfirmModal = useCallback(() => setShowConfirm(false), []);
  
  const openToast = useCallback(() => setShowToast(true), []);
  const closeToast = useCallback(() => setShowToast(false), []);
  
  const openResultModal = useCallback(() => setShowResultModal(true), []);
  const closeResultModal = useCallback(() => setShowResultModal(false), []);
  
  const openErrorModal = useCallback(() => setShowErrorModal(true), []);
  const closeErrorModal = useCallback(() => setShowErrorModal(false), []);

  // 모든 모달 닫기
  const closeAllModals = useCallback(() => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setShowConfirm(false);
    setShowToast(false);
    setShowResultModal(false);
    setShowErrorModal(false);
  }, []);

  return {
    // 모달 상태
    showAddModal,
    showEditModal,
    showDetailModal,
    showConfirm,
    showToast,
    showResultModal,
    showErrorModal,
    
    // 모달 제어 함수들
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDetailModal,
    closeDetailModal,
    openConfirmModal,
    closeConfirmModal,
    openToast,
    closeToast,
    openResultModal,
    closeResultModal,
    openErrorModal,
    closeErrorModal,
    closeAllModals,
  };
}
