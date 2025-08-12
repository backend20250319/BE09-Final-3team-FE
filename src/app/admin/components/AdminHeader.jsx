import styles from "@/app/admin/styles/ProductManagement.module.css";
import mainstyles from "@/app/styles/Header.module.css";
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
                <div className={mainstyles.signupButton}>
                    로그아웃
                </div>
            </div>
        </div>
    </header>
        </>
    )
}