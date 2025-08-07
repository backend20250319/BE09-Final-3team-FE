"use client";
import React from "react";
import NoticeCard from "./NoticeCard";
import styles from "../styles/NoticeList.module.css";
import posts from "@/app/notice/data/posts";
import {useRouter} from "next/navigation";


export default function NoticeList({activeTab}) {
  const router = useRouter();

  const handleClick = (id) => {
    router.push(`/notice/${id}`);
  };

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
