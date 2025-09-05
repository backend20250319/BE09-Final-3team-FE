"use client";
import styles from "../styles/NewPost.module.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registNewPost } from "@/api/postApi";
import axios from "axios";
import DeleteConfirmModal from "./DeleteConfirmModal";
import AlertModal from "./AlertModal";

export default function PostForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    router.push("/community");
  };
  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlertModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected) {
      showAlert("게시판을 선택해주세요.", "warning");
      return;
    }
    if (!title.trim()) {
      showAlert("제목을 입력해주세요.", "warning");
      return;
    }
    if (!content.trim()) {
      showAlert("내용을 입력해주세요.", "warning");
      return;
    }

    const ALLOWED_TYPES = ["INFORMATION", "QUESTION"];
    const type = ALLOWED_TYPES.includes(selected) ? selected : null;
    if (!type) {
      showAlert("게시판 유형이 올바르지 않습니다.", "error");
      return;
    }

    try {
      await registNewPost({ title, content, type });
      showAlert("등록 완료!", "success");
      setTimeout(() => {
        router.replace("/community");
      }, 2000);
    } catch (err) {
      console.error("[registNewPost] fail:", err);
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.msg ??
        err?.message ??
        "요청 중 오류가 발생했습니다.";

      if (status === 401) {
        showAlert("로그인이 필요합니다. 다시 로그인 후 시도해주세요.", "error");
      } else if (status === 400) {
        showAlert(`입력값을 확인해주세요.\n- ${msg}`, "warning");
      } else {
        showAlert(
          `등록에 실패했습니다. 잠시 후 다시 시도해주세요.\n- ${msg}`,
          "error"
        );
      }
    }
  };

  const options = [
    { label: "정보 공유", value: "INFORMATION" },
    { label: "Q&A", value: "QUESTION" },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div style={{ fontSize: "30px", textAlign: "center" }}>
          새 게시글 등록
        </div>
        <div className={styles.selectpost}>
          <div className={styles.label}>게시판 선택</div>
          <div style={{ position: "relative", width: "574px" }}>
            <div
              onClick={() => setOpen(!open)}
              style={{
                padding: "10px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                backgroundColor: "#FFFFFF",
                color: selected ? "#111827" : "#9CA3AF",
                cursor: "pointer",
              }}
            >
              {selected
                ? options.find((o) => o.value === selected)?.label
                : "게시판을 선택해주세요."}
            </div>
            {open && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  marginTop: "4px",
                  zIndex: 10,
                }}
              >
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      setSelected(option.value);
                      setOpen(false);
                    }}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      color: "#111827",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={styles.formContainer}>
          <div className={styles.label}>게시글 제목</div>
          <input
            type="text"
            className={styles.inputBox}
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.label}>게시글 내용</div>
          <textarea
            className={styles.contentBox}
            placeholder="게시글 내용을 입력해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
          />
          {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        </div>
        <div className={styles.btnarea}>
          <button
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={submitting}
          >
            취소
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "등록 중..." : "게시글 등록"}
          </button>
        </div>
      </div>

      {/* 취소 확인 모달 */}
      <DeleteConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        title="작성 취소"
        message="게시글 작성을 취소하시겠습니까?"
        confirmText="취소"
        cancelText="계속 작성"
      />

      {/* 알림 모달 */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="알림"
        message={alertMessage}
        type={alertType}
        confirmText="확인"
      />
    </div>
  );
}
