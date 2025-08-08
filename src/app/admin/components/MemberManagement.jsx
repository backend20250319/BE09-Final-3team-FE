'use client';
import styles from "@/app/admin/styles/ProductManagement.module.css";
import PopupModal from "@/app/admin/components/PopupModal";
import React, {useState} from "react";
import petstars from "@/app/admin/data/petstars";
import reportLogs from "@/app/admin/data/reportLogs";


export default function MemberManagement(){
    const [activeTab, setActiveTab] = useState("펫스타 지원");
    const [isModalOpen,setIsModalOpen] = useState(false);
    const handleRestrict = (productId) => {
        console.log(`Delete product ${productId}`);
        // 제한 로직 구현
    };
    const handleReject = (productId) => {
        console.log(`Reject product ${productId}`);
        // 거절 로직 구현
    };
    const handleApprove = (productId) => {
        console.log(`Approve product ${productId}`);
        // 승인 로직 구현
    };

    return(
        <>
            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.content}>
                    {/* Navigation Tabs */}
                    <div className={styles.tabNavigation}>
                        <nav className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${
                                    activeTab === "펫스타 지원" ? styles.active : ""
                                }`}
                                onClick={() => setActiveTab("펫스타 지원")}
                            >
                                펫스타 지원자 목록
                            </button>
                            <button
                                className={`${styles.tab} ${
                                    activeTab === "신고당한 회원" ? styles.active : ""
                                }`}
                                onClick={() => setActiveTab("신고당한 회원")}
                            >
                                신고당한 회원 목록
                            </button>
                        </nav>
                    </div>

                    {/* Search and Filter */}
                    <div className={styles.searchSection}>
                        <div>
                            {activeTab==="펫스타 지원"? <h2 className={styles.sectionTitle}>펫스타 지원자 목록</h2> : <h2 className={styles.sectionTitle}>
                                신고당한 회원 목록
                            </h2>}
                        </div>
                        <div className={styles.rightControls}>
                            <div className={styles.searchContainer}>
                                <input
                                    type="text"
                                    placeholder="검색어를 입력하세요."
                                    className={styles.searchInput}
                                />
                                <div className={styles.searchIcon}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M11 11L15 15"
                                            stroke="#9CA3AF"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <circle
                                            cx="7"
                                            cy="7"
                                            r="6"
                                            stroke="#9CA3AF"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <select className={styles.sortSelect}>
                                <option>최신순</option>
                                <option>오래된순</option>
                            </select>
                        </div>
                    </div>
                    {/* Product List */}
                    <section className={styles.productSection}>
                        <div className={styles.productList}>
                            {activeTab === "펫스타 지원" &&
                                petstars.map((petstar) => (
                                    <div key={petstar.id} className={styles.productCard}>
                                        <div className={styles.productContent}>
                                            <div className={styles.productImage}>
                                                <img src={petstar.petImage} alt={petstar.petName} />
                                            </div>
                                            <div className={styles.productInfo}>
                                                <h3 className={styles.productTitle}>{petstar.petName}</h3>
                                                <p className={styles.productDescription}>{petstar.petSnS}</p>
                                                <div className={styles.companyInfo}>
                                                    <img src={petstar.ownerImg} className={styles.companyLogo} />
                                                    <div className={styles.companyDetails}>
                                                        <span className={styles.companyName}>{petstar.ownerName}</span>
                                                        <span className={styles.companyType}>
                    {petstar.ownerPhone} || {petstar.ownerEmail}
                  </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.productActions} style={{ width: "265px" }}>
                                            <button className={styles.approveBtn} onClick={handleApprove}>
                                                APPROVE
                                            </button>
                                            <button className={styles.rejectBtn} onClick={() => setIsModalOpen(true)}>
                                                REJECT
                                            </button>
                                            <PopupModal
                                                isOpen={isModalOpen}
                                                onClose={() => setIsModalOpen(false)}
                                                onDelete={handleReject}
                                                productTitle="신규 캠페인: 여름 할인 50%"
                                                actionType="petstarreject"
                                                targetKeyword={petstar.petName}
                                            />
                                        </div>
                                    </div>
                                ))}

                            {activeTab === "신고당한 회원" &&
                                reportLogs.map((reportLogs) => (
                                    <div key={reportLogs.id} className={styles.productCard}>
                                        <div className={styles.productContent}>
                                            <div className={styles.productImage}>
                                                <img src={reportLogs.profileImage} alt={reportLogs.target} />
                                            </div>
                                            <div className={styles.productInfo}>
                                                <div className={styles.resonleft} style={{fontSize:"larger"}}>{reportLogs.target}</div>
                                               <div className={styles.reasonleft}>{reportLogs.reason}</div>
                                                <div className={styles.reasonright} style={{fontSize:"larger"}}>{reportLogs.reporter}</div>
                                            </div>
                                        </div>
                                        <div className={styles.productActions} style={{ width: "265px" }}>
                                            <button className={styles.deleteBtn} onClick={() => setIsModalOpen(true)}>
                                                RESTRICT
                                            </button>
                                            <PopupModal
                                                isOpen={isModalOpen}
                                                onClose={() => setIsModalOpen(false)}
                                                onDelete={handleRestrict}
                                                productTitle="신고된 사용자 제재"
                                                actionType="restrict"
                                                targetKeyword={reportLogs.target}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}


