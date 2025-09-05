"use client";
import React from "react";
import styles from "../styles/Pagination.module.css";

export default function Pagination({
                                       page,              // 현재 페이지 (0-based)
                                       totalPages,        // 총 페이지 수
                                       onChange,          // (nextPage:number) => void
                                       windowSize = 5,    // 가운데 기준으로 보여줄 버튼 개수
                                   }) {
    const hasTotal = Number.isFinite(totalPages) && totalPages > 0;

    const clamp = (p) =>
        hasTotal ? Math.min(Math.max(0, p), totalPages - 1) : Math.max(0, p);
    const go = (p) => () => onChange?.(clamp(p));

    // 현재 페이지를 중심으로 windowSize만큼 번호 만들기
    const makeWindow = (current, total, win) => {
        if (!hasTotal) return [];
        const half = Math.floor(win / 2);
        let start = Math.max(0, current - half);
        let end = Math.min(total - 1, start + win - 1);
        start = Math.max(0, end - win + 1);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pages = makeWindow(page, totalPages, windowSize);

    return (
        <div className={styles.container}>
            {/* 이전 */}
            <button
                className={styles.prevBtn}
                onClick={go(page - 1)}
                disabled={page <= 0}
            >
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                    <path
                        d="M8 2L2 8L8 14"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* 맨 앞쪽 처리 (1 ... ) */}
            {hasTotal && pages[0] > 0 && (
                <>
                    <button className={styles.pageBtn} onClick={go(0)}>1</button>
                    {pages[0] > 1 && <span className={styles.ellipsis}>…</span>}
                </>
            )}

            {/* 가운데 윈도우 */}
            {hasTotal &&
                pages.map((p) => (
                    <button
                        key={p}
                        onClick={go(p)}
                        className={`${styles.pageBtn} ${p === page ? styles.active : ""}`}
                        aria-current={p === page ? "page" : undefined}
                    >
                        {p + 1}
                    </button>
                ))}

            {/* 맨 뒤쪽 처리 ( ... N) */}
            {hasTotal && pages[pages.length - 1] < totalPages - 1 && (
                <>
                    {pages[pages.length - 1] < totalPages - 2 && (
                        <span className={styles.ellipsis}>…</span>
                    )}
                    <button
                        className={styles.pageBtn}
                        onClick={go(totalPages - 1)}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* 다음 */}
            <button
                className={styles.nextBtn}
                onClick={go(page + 1)}
                disabled={hasTotal ? page >= totalPages - 1 : false}
            >
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                    <path
                        d="M2 2L8 8L2 14"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}
