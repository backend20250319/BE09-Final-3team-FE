"use client";
import React from "react";
import NoticeCard from "./NoticeCard";
import styles from "../styles/NoticeList.module.css";
import posts from "@/app/notice/data/posts";

export default function NoticeList({activeTab}) {

  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <NoticeCard key={post.id} post={post} />
      ))}
    </div>
  );
}
