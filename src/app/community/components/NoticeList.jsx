"use client";
import React, { useEffect, useState } from "react";
import NoticeCard from "./NoticeCard";
import styles from "../styles/NoticeList.module.css";
import { useRouter } from "next/navigation";
import { getAllPost, getMyPost } from "@/api/postApi";
import { POST_TYPE_TABS } from "@/app/community/constants/post";

export default function NoticeList({ activeTab, mineOnly = false, page , size , onLoaded }) {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    // 탭 값(라벨/enum 모두 허용) → enum 값으로 정규화
    const type =
        POST_TYPE_TABS.find(t => t.value === activeTab || t.label === activeTab)?.value || null;

    useEffect(() => {
        const ac = new AbortController();
        setLoading(true);
        setErr(null);

        const fetcher = mineOnly ? getMyPost : getAllPost;

        fetcher({ page, size, type, signal: ac.signal })
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.content ?? [];

                // 백엔드에서 타입 필터를 받지 않으니 프론트에서 필터
                const filtered = type
                    ? list.filter(p => (p.type ?? p.postType ?? p.category) === type)
                    : list;

                setPosts(filtered);
                onLoaded?.(data);
            })
            .catch((e) => {
                if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
                setErr(e?.response?.data?.message ?? "목록을 불러오지 못했습니다.");
            })
            .finally(() => setLoading(false));

        return () => ac.abort();
    }, [mineOnly, type,page,size ,onLoaded]);

    const handleClick = (id) => router.push(`/community/${id}`);

    if (loading) return <div className={styles.container}>불러오는 중…</div>;
    if (err) return <div className={styles.container} style={{ color: "red" }}>{err}</div>;
    if (!posts.length) return <div className={styles.container}>게시글이 없습니다.</div>;


    console.log("[NoticeCard] post =", posts);
    return (
        <div className={styles.container}>
            {posts.map((post) => {
                const pid = post.id ?? post.postId;
                return (
                    <div key={pid} onClick={() => handleClick(pid)}>
                        <NoticeCard post={post} />
                    </div>
                );
            })}
        </div>
    );
}
