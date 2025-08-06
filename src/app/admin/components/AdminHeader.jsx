import styles from "@/app/admin/styles/ProductManagement.module.css";
import React from "react";

export default function AdminHeader(){
    return(
        <>
        {/* Header */}
    <header className={styles.header}>
        <div className={styles.headerContent}>
            <div className={styles.logo}>
                <h1>PetFulAdmin</h1>
            </div>
            <div className={styles.headerActions}>
                <button className={styles.notificationBtn}>
                    <svg width="18" height="21" viewBox="0 0 18 21" fill="none">
                        <path
                            d="M9 21C10.6569 21 12 19.6569 12 18H6C6 19.6569 7.34315 21 9 21Z"
                            fill="#4B5563"
                        />
                        <path
                            d="M16 8C16 4.13401 12.866 1 9 1C5.13401 1 2 4.13401 2 8V13L0 16H18L16 13V8Z"
                            stroke="#4B5563"
                            strokeWidth="2"
                        />
                    </svg>
                    <span className={styles.notificationBadge}></span>
                </button>
                <button className={styles.profileBtn}>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path
                            d="M10 10.5C12.7614 10.5 15 8.26142 15 5.5C15 2.73858 12.7614 0.5 10 0.5C7.23858 0.5 5 2.73858 5 5.5C5 8.26142 7.23858 10.5 10 10.5Z"
                            fill="#4B5563"
                        />
                        <path
                            d="M0 20.5C0 16.0817 3.58172 12.5 8 12.5H12C16.4183 12.5 20 16.0817 20 20.5"
                            stroke="#4B5563"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </header>
        </>
    )
}