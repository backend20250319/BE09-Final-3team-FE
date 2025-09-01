"use client";
import React, { useState } from "react";
import styles from "../styles/CommentItem.module.css";
import ReportModal from "@/app/advertiser/ads-list/[ad_no]/components/ReportModal";
import Image from "next/image";
import CommentForm from "./CommentForm";

const MAX_DEPTH = 1; // 댓글(0) -> 대댓글(1)까지만

export default function CommentItem({
        comment,
        onReply,
        onDelete,            // ✅ 추가
        currentUserNo,       // ✅ 추가 (토큰에서 꺼낸 userNo 등)
        depth = 0,
    }) {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [openReply, setOpenReply] = useState(false);

    if (!comment) return null;

    // AuthorDto or legacy fields 안전 매핑
    const hasAuthorObj = comment.author && typeof comment.author === "object";
    const authorName =
        (hasAuthorObj && (comment.author.nickname || "익명")) ||
        comment.authorName ||
        comment.nickname ||
        (typeof comment.author === "string" ? comment.author : "익명");

    const avatar =
        (hasAuthorObj && (comment.author.profileImageUrl || comment.author.avatarUrl)) ||
        comment.avatar ||
        comment.profileImage ||
        "/user/avatar-placeholder.jpg";

    const timeText = comment.time ?? formatRelative(comment.createdAt);

    const handleSubmitReply = async ({content}) => {
        await onReply?.({content, parentId: comment.id});
        setOpenReply(false);
    };

    const canReply = depth < MAX_DEPTH;
    const hasChildren = Array.isArray(comment.children) && comment.children.length > 0;

// 내 userNo (prop 우선, 없으면 localStorage 백업)
    const meNo =
        currentUserNo ??
        (typeof window !== "undefined"
            ? localStorage.getItem("userNo") || localStorage.getItem("userId")
            : null);

// 댓글 소유자 id를 여러 필드에서 안전하게 추출
    const ownerId =
        comment.userNo ??
        comment.userId ??
        comment.author?.id;

// 문자열/숫자 섞여도 동일 비교
    const isOwner = meNo != null && ownerId != null && String(meNo) === String(ownerId);
    const isDeleted = (comment.commentStatus || comment.status) === "DELETED";
// 본인 & 미삭제만 삭제 가능
    const canDelete = !isDeleted && isOwner;

    // 상태에 따라 내용 대체
    const contentText = isDeleted ? "삭제된 댓글입니다." : (comment.content ?? "");

    const handleClickDelete = async () => {
        if (confirm("이 댓글을 삭제할까요? (내용은 '삭제된 댓글입니다.'로 표시됩니다)")) {
            await onDelete?.(comment.id); // ✅ 상위에서 optimistic + 폴백 재조회
        }
    };
    console.log("[CommentItem] meNo =", meNo,
        "ownerId =", ownerId,
        "isDeleted =", isDeleted,
        "isOwner =", isOwner,
        "canDelete =", canDelete,
        "comment =", comment);


    return (
        <div className={styles.container} data-id={comment.id}>
            <img
                src={avatar}
                alt={authorName}
                className={styles.avatar}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/user/avatar-placeholder.jpg";
                }}
            />

            <div className={styles.content}>
                {/* 상단 헤더: 닉네임(왼쪽) / 신고 + (내 댓글이면) 삭제(오른쪽) */}
                <div
                    className={styles.header}
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                >
                    <span className={styles.author}>{isDeleted ? "(삭제됨)" : authorName}</span>

                    <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                        {!isDeleted && (
                            <button
                                className={styles.sirenButton}
                                onClick={() => setIsReportModalOpen(true)}
                                style={{backgroundColor: "white"}}
                                aria-label="신고"
                                title="신고"
                            >
                                <Image src="/siren.png" alt="siren.png" width={30} height={30}/>
                            </button>
                        )}
                        {canDelete && (
                            <button
                                className={styles.deleteButton ?? styles.replyButton}
                                onClick={handleClickDelete}
                                aria-label="댓글 삭제"
                                title="댓글 삭제"
                            >
                                삭제
                            </button>
                        )}
                    </div>
                </div>

                {/* 본문 */}
                <p className={styles.text}>{contentText}</p>

                {/* 하단 푸터: 시간(왼쪽) / 답글달기(오른쪽) */}
                <div
                    className={styles.actionsRow}
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                >
                    <span className={styles.time}>{timeText}</span>

                    {canReply ? (
                        <button
                            className={styles.replyButton}
                            onClick={() => setOpenReply((v) => !v)}
                            disabled={isDeleted}
                            title={isDeleted ? "삭제된 댓글에는 답글을 달 수 없습니다." : "답글 달기"}
                        >
                            <svg
                                className={styles.replyIcon}
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <path
                                    d="M7 12L6.5 11.5C3.5 8.5 1 6.5 1 4C1 2.5 2 1.5 3.5 1.5C4.5 1.5 5.5 2 6 3C6.5 2 7.5 1.5 8.5 1.5C10 1.5 11 2.5 11 4C11 6.5 8.5 8.5 5.5 11.5L7 12Z"
                                    fill="currentColor"
                                />
                            </svg>
                            답글 달기
                        </button>
                    ) : (
                        <span/>
                    )}
                </div>

                {openReply && canReply && !isDeleted && (
                    <div style={{marginTop: 8}}>
                        <CommentForm
                            parentId={comment.id}
                            onAddComment={handleSubmitReply}
                            autoFocus
                            onCancel={() => setOpenReply(false)}
                        />
                    </div>
                )}

                {/* 자식 댓글 */}
                {hasChildren && depth < MAX_DEPTH && (
                    <div style={{marginLeft: 48, marginTop: 8}}>
                        {comment.children.map((child) => (
                            <CommentItem
                                key={child.id}
                                comment={child}
                                onReply={onReply}
                                onDelete={onDelete}
                                currentUserNo={currentUserNo}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}

                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    applicantName={authorName}
                />
            </div>
        </div>
    );
}

    /** "방금 전 / 5분 전 / 2시간 전 ..." 상대시간 */
function formatRelative(v) {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    let s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 5) return "방금 전";
    if (s < 60) return `${s}초 전`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}분 전`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전`;
    const days = Math.floor(h / 24);
    if (days < 7) return `${days}일 전`;
    const w = Math.floor(days / 7);
    if (w < 5) return `${w}주 전`;
    const mo = Math.floor(days / 30);
    if (mo < 12) return `${mo}개월 전`;
    const y = Math.floor(days / 365);
    return `${y}년 전`;
}
