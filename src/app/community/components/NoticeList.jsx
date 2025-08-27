"use client";
import React, {useEffect, useMemo, useState} from "react";
import NoticeCard from "./NoticeCard";
import styles from "../styles/NoticeList.module.css";
import {useRouter} from "next/navigation";
import {getAllPost} from "@/app/api/postApi";


export default function NoticeList({activeTab, page=0,size = 5,onLoaded}) {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err,setErr] = useState(null);

  const abortCtrl = useMemo(()=>new AbortController(),[activeTab,page,size]);

  useEffect(()=> {
    setLoading(true);
    setErr(null);

    getAllPost({category:activeTab,page,size,signal:abortCtrl.signal})
        .then((data) => {
          const items = Array.isArray(data) ? data:data.content ?? [];
          setPosts(items);
          onLoaded?.(data);
        })
        .catch((e) => {
          if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
          setErr(e?.response?.data?.message ?? "목록을 불러오지 못했습니다.");
        })
        .finally(() => setLoading(false));
    return () => abortCtrl.abort();
  }, [activeTab, page, size, abortCtrl, onLoaded]);

  const handleClick = (id) => {
    router.push(`/community/${id}`);
  };

  if (loading) return <div className={styles.container}>불러오는 중…</div>;
  if (err) return <div className={styles.container} style={{ color: "red" }}>{err}</div>;
  if (!posts.length) return <div className={styles.container}>게시글이 없습니다.</div>;

  return (
    <div className={styles.container}>
      {posts.map((post) => (
          <div key={post.id} onClick={() => handleClick(post.id)}>
            <NoticeCard post={post} />
          </div>
      ))}
    </div>
  );
}
