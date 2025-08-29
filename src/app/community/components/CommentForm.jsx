"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/CommentForm.module.css";
import api from "@/api/api";

export default function CommentForm({
                                        onAddComment,     // (required) async ({ content, parentId }) => void
                                        parentId = null,  // (optional) 대댓글 부모 ID
                                        autoFocus = false,// (optional) textarea 자동 포커스
                                        onCancel,         // (optional) 취소 버튼 동작
                                    }) {
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState("/default-avatar.png");

    // 아바타 로딩
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                // 1) 현재 사용자 정보 조회 (/users/me)
                const me = await api.get("/users/me");
                if (mounted && me?.data?.profileImage) {
                    setAvatarSrc(me.data.profileImage);
                    return;
                }
            } catch (_) {}

            try {
                // 2) localStorage 기반 fallback
                if (typeof window !== "undefined") {
                    const uid = localStorage.getItem("userId");
                    if (uid) {
                        const res = await api.get(`/users/${uid}`);
                        if (mounted && res?.data?.profileImage) {
                            setAvatarSrc(res.data.profileImage);
                            return;
                        }
                    }
                }
            } catch (_) {}

            if (mounted) setAvatarSrc("/default-avatar.png");
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = comment.trim();
        if (!content || submitting) return;

        try {
            setSubmitting(true);
            await onAddComment?.({ content, parentId });
            setComment(""); // 성공 시 초기화
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            void handleSubmit(e);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>댓글 남기기</h3>

            <form className={styles.form} onSubmit={handleSubmit}>
                <img
                    src={avatarSrc}
                    alt="User"
                    className={styles.avatar}
                    onError={() => setAvatarSrc("/default-avatar.png")}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                />

                <div className={styles.content}>
          <textarea
              className={styles.textarea}
              placeholder="댓글을 작성하세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              autoFocus={autoFocus}
              disabled={submitting}
          />

                    <div className={styles.submit}>
                        {onCancel && (
                            <button
                                type="button"
                                className={styles.submitButton}
                                onClick={onCancel}
                                disabled={submitting}
                                style={{ marginRight: 8 }}
                            >
                                취소
                            </button>
                        )}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={!comment.trim() || submitting}
                        >
                            {submitting ? "등록 중..." : "댓글 작성"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
