'use client';
import styles from "@/app/admin/styles/ProductManagement.module.css";
import React, {useState} from "react";


export default function AdminSideBar({activeSidebar,setActiveSidebar}){
    return(
        <>
        {/* Sidebar */}
    <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
            <div className={styles.navSection}>
                <h3>관리</h3>
                <ul className={styles.navList}>
                    <li
                        className={styles.navItem}
                        onClick={() => setActiveSidebar("상품 관리")}
                    >
                        {activeSidebar === "상품 관리" ? (
                            <div className={styles.activeIndicator}>
                                <div className={styles.activeIcon}>
                                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                                        <path
                                            d="M1 1H13V15H1V1Z"
                                            stroke="#CA8A04"
                                            strokeWidth="2"
                                        />
                                        <path d="M4 4H10" stroke="#CA8A04" strokeWidth="2" />
                                        <path d="M4 7H10" stroke="#CA8A04" strokeWidth="2" />
                                        <path d="M4 10H7" stroke="#CA8A04" strokeWidth="2" />
                                    </svg>
                                </div>
                                <span>상품 관리</span>
                            </div>
                        ) : (
                            <div className={styles.navIndicator}>
                                <div className={styles.navIcon}>
                                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                                        <path
                                            d="M1 1H13V15H1V1Z"
                                            stroke="#4B5563"
                                            strokeWidth="2"
                                        />
                                        <path d="M4 4H10" stroke="#4B5563" strokeWidth="2" />
                                        <path d="M4 7H10" stroke="#4B5563" strokeWidth="2" />
                                        <path d="M4 10H7" stroke="#4B5563" strokeWidth="2" />
                                    </svg>
                                </div>
                                <span>상품 관리</span>
                            </div>
                        )}
                    </li>

                    <li
                        className={styles.navItem}
                        onClick={() => setActiveSidebar("회원 관리")}
                    >
                        {activeSidebar === "회원 관리" ? (
                            <div className={styles.activeIndicator}>
                                <div className={styles.activeIcon}>
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                                        <path
                                            d="M10 8C12.2091 8 14 6.20914 14 4C14 1.79086 12.2091 0 10 0C7.79086 0 6 1.79086 6 4C6 6.20914 7.79086 8 10 8Z"
                                            fill="#CA8A04"
                                        />
                                        <path
                                            d="M0 16C0 12.6863 2.68629 10 6 10H14C17.3137 10 20 12.6863 20 16"
                                            stroke="#CA8A04"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                                <span>회원 관리</span>
                            </div>
                        ) : (
                            <div className={styles.navIndicator}>
                                <div className={styles.navIcon}>
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                                        <path
                                            d="M10 8C12.2091 8 14 6.20914 14 4C14 1.79086 12.2091 0 10 0C7.79086 0 6 1.79086 6 4C6 6.20914 7.79086 8 10 8Z"
                                            fill="#4B5563"
                                        />
                                        <path
                                            d="M0 16C0 12.6863 2.68629 10 6 10H14C17.3137 10 20 12.6863 20 16"
                                            stroke="#4B5563"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                                <span>회원 관리</span>
                            </div>
                        )}
                    </li>

                </ul>
            </div>
        </nav>
    </aside>
        </>
    )
}