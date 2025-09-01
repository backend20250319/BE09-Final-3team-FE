"use client";
import React, { useEffect, useState } from "react";
import PostContent from "./PostContent";
import CommentSection from "./CommentSection";
import styles from "../styles/PostDetail.module.css";
import {deletePost, getPostDetail} from "@/api/postApi";

export default function PostDetail({ postId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        if (!postId) {
            setLoading(false);
            setErr("잘못된 접근입니다.");
            return;
        }

        setLoading(true);
        setErr(null);

        const controller = new AbortController();

        (async () => {
            try {
                const dto = await getPostDetail(postId, { signal: controller.signal });
                console.log("[PostDetail] dto =", dto);
                setData(dto); // DTO 그대로 보관
            } catch (e) {
                if (e?.code !== "ERR_CANCELED") {
                    setErr(e?.response?.data?.message ?? e?.message ?? "불러오기에 실패했습니다.");
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [postId]);

    if (loading) return <div className={styles.container}>불러오는 중…</div>;
    if (err) return <div className={styles.container} style={{ color: "red" }}>{err}</div>;
    if (!data) return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>;
    function formatRelativeKo(value) {
        const d = new Date(value);
        if (isNaN(d.getTime())) return "";
        let secs = Math.floor((Date.now() - d.getTime()) / 1000);
        if (secs < 0) secs = 0;

        if (secs < 5) return "방금 전";
        if (secs < 60) return `${secs}초 전`;
        const mins = Math.floor(secs / 60);
        if (mins < 60) return `${mins}분 전`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}시간 전`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}일 전`;
        const weeks = Math.floor(days / 7);
        if (weeks < 5) return `${weeks}주 전`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}개월 전`;
        const years = Math.floor(days / 365);
        return `${years}년 전`;
    }

    function fmtAbs(v) {
        try { return v ? new Date(v).toLocaleString() : ""; } catch { return String(v); }
    }

    function toVM(dto = {}) {
        return {
            postId: dto.postId,
            userId: dto.userId,
            title: dto.title,
            content: dto.content,
            type: dto.type,
            createdAt: dto.createdAt,
            mine: !!dto.mine,
            commentCount: dto.commentCount ?? 0,
        };
    }

    const vm = toVM(data);

    const handleDelete = async () => {
        if(!confirm("정말 게시글을 삭제하시겠습니까?")) return;
        try {
            await deletePost(vm.postId);
            alert("삭제되었습니다.");
            window.history.back(); // 목록으로
        } catch (e) {
            alert(e?.response?.data?.message ?? "삭제에 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.backButton}>
                    <button onClick={() => window.history.back()} className={styles.backBtn}>
                        ← 목록으로 돌아가기
                    </button>
                </div>

                <article className={styles.postCard}>
                    <PostContent
                        post={{
                            Id: vm.postId,
                            title: vm.title,
                            author: vm.userId ? `작성자 #${vm.userId}` : "익명",
                            date: formatRelativeKo(vm.createdAt),
                            commentCount: vm.commentCount,
                            mine: vm.mine,
                            content: [vm.content ?? ""],
                        }}
                        onDelete={handleDelete}
                    />
                </article>

                <section className={styles.commentSection}>
                    <CommentSection
                        postId={vm.postId}
                        autoRefresh={false}
                    />
                </section>
            </main>
        </div>
    );
}



