"use client";
import React, { useState } from "react";
import styles from "../styles/PopupModal.module.css";

export default function PopupModal({
  isOpen,
  onClose,
  onDelete,
  actionType,
  targetKeyword="",
}) {
  const [deleteReason, setDeleteReason] = useState("");
  const getModalContent = () => {
    switch(actionType) {
      case "delete":
      return{
        title:"삭제하기",
        label:"광고 제목",
        description:"광고를 삭제하시겠습니까?",
        confirmText:"삭제하기",
        textfield:"삭제 사유",
        placeholder:"삭제 사유를 입력하세요.",
      };
      case "productreject":
        return{
          title:"거절하기",
          label:"광고 제목",
          description:"광고 승인을 반려하시겠습니까?",
          confirmText:"반려하기",
          textfield:"반려 사유",
          placeholder:"반려 사유를 입력하세요.",
        };
      case "petstarreject":
        return{
          title:"반려하기",
          label:"펫스타 아이디",
          description:"펫스타 요청을 반려하시겠습니까?",
          confirmText:"반려하기",
          textfield:"반려 사유",
          placeholder:"반려 사유를 입력하세요.",
        };
      case "restrict":
        return{
          title:"제한하기",
          label:"회원 아이디",
          description:"회원 활동을 제한하시겠습니까?",
          confirmText:"제한하기",
          textfield:"제한 사유",
          placeholder:"제한 사유를 입력하세요.",
        };
    }
  }
  const handleDelete = () => {
    if (deleteReason.trim()) {
      onDelete(deleteReason);
      setDeleteReason("");
      onClose();
    }
  };

  const handleCancel = () => {
    setDeleteReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div className={styles.iconContainer}>
                <div className={styles.iconWrapper}>
                  <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
                    <path
                      d="M1 3H17M4 3V2C4 1.44772 4.44772 1 5 1H13C13.5523 1 14 1.44772 14 2V3M15.5 3V25C15.5 26.1046 14.6046 27 13.5 27H4.5C3.39543 27 2.5 26.1046 2.5 25V3H15.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div className={styles.headerText}>
                <h2>{getModalContent().title}</h2>
                <p>{getModalContent().description}</p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={handleCancel}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M1 13L13 1"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.formSection}>
            {/* Product Title */}
            <div className={styles.formGroup}>
              <label className={styles.label}>{getModalContent().label}</label>
              <div className={styles.titleDisplay}>
                <span>{targetKeyword}</span>
              </div>
            </div>

            {/* Delete Reason */}
            <div className={styles.formGroup}>
              <div className={styles.labelContainer}>
                <label className={styles.label}>{getModalContent().textfield}</label>
                <span className={styles.required}>*</span>
              </div>
              <div className={styles.textareaContainer}>
                <textarea
                  className={styles.textarea}
                  placeholder={getModalContent().placeholder}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.buttonContainer}>
            <button className={styles.cancelBtn} onClick={handleCancel}>
              취소
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={!deleteReason.trim()}
            >
              <svg width="12" height="18" viewBox="0 0 12 16" fill="none">
                <path
                  d="M1 3H11M4 3V2C4 1.44772 4.44772 1 5 1H7C7.55228 1 8 1.44772 8 2V3M9.5 3V13C9.5 14.1046 8.60457 15 7.5 15H4.5C3.39543 15 2.5 14.1046 2.5 13V3H9.5Z"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              <a style={{marginTop:"2px"}}>{getModalContent().confirmText}</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
