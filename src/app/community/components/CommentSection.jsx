"use client";
import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import styles from "../styles/CommentSection.module.css";
import { getComments, createComment } from "@/api/commentApi";
import {deletePost} from "@/api/postApi";

export default function CommentSection({ postId, autoRefresh = false }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    // 댓글 불러오기
    useEffect(() => {
        if (!postId) return;
        setLoading(true);
        setErr(null);
        getComments(postId)
            .then((list) => setComments(normalizeList(list)))
            .catch((e) => {
                console.error("[CommentSection] getComments error:", e);
                setComments([]);
                setErr(e?.response?.data?.message ?? "댓글을 불러오지 못했습니다.");
            })
            .finally(() => setLoading(false));
    }, [postId, autoRefresh]);

    // 댓글 추가 핸들러
    const handleAddComment = async ({ content, parentId = null }) => {
        try {
            setErr(null);
            const saved = await createComment({ postId, content, parentId });

            if (saved?.id || saved?.commentId) {
                const node = toNode(saved);
                setComments((prev) => insertNode(prev, node));
            } else {
                // 안전하게 다시 불러오기
                const fresh = await getComments(postId);
                setComments(normalizeList(fresh));
            }
        } catch (e) {
            console.error("[CommentSection] createComment error:", e);
            setErr(e?.response?.data?.message ?? e?.message ?? "댓글 등록 실패");
        }
    };
    const handleDeleteComment = async (commentId) => {
        setComments(prev=>markDeleted(prev,commentId));
        try{
            await deletePost(commentId);
            const fresh = await getComments(postId);
            setComments((normalizeList(fresh)));
        } catch (err){
            console.error("삭제 실패",err);
            const fresh = await  getComments(postId);
            setComments(normalizeList(fresh));
        }
    }


    if (err) return <div className={styles.commentList} style={{ color: "red" }}>{err}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>댓글</h2>

            {/* 목록 영역 */}
            <div className={styles.commentList}>
                {loading && <div>댓글 불러오는 중…</div>}
                {!loading && err && (
                    <div style={{ color: "red" }}>{err}</div>
                )}
                {!loading && !err && comments.length === 0 && (
                    <p>댓글이 없습니다.</p>
                )}
                {!loading && !err && comments.length > 0 && (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={handleAddComment}
                        />
                    ))
                )}
            </div>

            <div className={styles.commentForm}>
                <CommentForm onAddComment={handleAddComment} />
            </div>
        </div>
    );
}

// 댓글 리스트 평탄화 → 계층형으로 변환
function normalizeList(list) {
    if (!Array.isArray(list)) return [];
    return list.map((n) => toNode(n));
}

// 서버 DTO → Node 변환
function toNode(n = {}, depth = 0) {
    const rawChildren = Array.isArray(n.children ?? n.replies) ? (n.children ?? n.replies) : [];
    const children = depth < 1 ? rawChildren.map((ch) => toNode(ch, depth + 1)) : [];

    return {
        id: n.commentId ?? n.id,
        parentId: n.parentId ?? null,
        userId: n.userId ?? n.author?.id ?? null,
        author: n.author
            ? {
                id: n.author.id,
                name: n.author.name ?? "익명",
                avatarUrl: n.author.profileUrl ?? null,
            }
            : { id: null, name: "익명", avatarUrl: null },
        content: n.content ?? "",
        createdAt: n.createdAt ?? null,
        children,
    };
}

// 새 노드 삽입 (최대 depth=1)
function insertNode(list, node, currentDepth = 0) {
    if (!node.parentId) return [node, ...list]; // 최상위 댓글 추가

    return list.map((item) => {
        if (item.id === node.parentId) {
            if (currentDepth === 0) {
                return { ...item, children: [node, ...(item.children || [])] };
            }
            return item; // depth 2 이상은 허용 안 함
        }
        return { ...item, children: insertNode(item.children || [], node, currentDepth + 1) };
    });
}

//댓글트리에서 특정 노드 소프트 삭제로 변경
const markDeleted = (list, targetId) => {
    const eq = (a, b) => String(a) === String(b);
    return (list || []).map(item => {
        if (eq(item.id, targetId)) {
            return {
                ...item,
                status: "DELETED",
                content: "",         // 서버 규칙에 맞춰 내용 비움
                // 필요한 경우 author를 익명 처리하고 싶다면 아래처럼:
                // author: { ...item.author, name: "익명", avatarUrl: null },
            };
        }
        return { ...item, children: markDeleted(item.children || [], targetId) };
    });
};
