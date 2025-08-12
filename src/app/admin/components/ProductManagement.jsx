'use client';
import styles from "@/app/admin/styles/ProductManagement.module.css";
import PopupModal from "@/app/admin/components/PopupModal";
import React, {useState} from "react";
import products from "../data/products";


export default function ProductManagement(){
    const [activeTab, setActiveTab] = useState("조회");
    const [isModalOpen,setIsModalOpen] = useState(false);
    const handleDelete = (productId) => {
        console.log(`Delete product ${productId}`);
        // 삭제 로직 구현
    };
    const handleReject = (productId) => {
        console.log(`Reject product ${productId}`);
        // 삭제 로직 구현
    };

    const handleApprove = () => {
        if(confirm("승인하시겠습니까?")){
            alert("승인되었습니다.")
        }else{
            alert("승인이 취소되었습니다.")
        }
    }

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
                                    activeTab === "조회" ? styles.active : ""
                                }`}
                                onClick={() => setActiveTab("조회")}
                            >
                                상품 조회
                            </button>
                            <button
                                className={`${styles.tab} ${
                                    activeTab === "승인" ? styles.active : ""
                                }`}
                                onClick={() => setActiveTab("승인")}
                            >
                                상품 승인/반려
                            </button>
                        </nav>
                    </div>

                    {/* Search and Filter */}
                    <div className={styles.searchSection}>
                        <div>
                            {activeTab==="조회"? <h2 className={styles.sectionTitle}>상품 조회</h2> : <h2 className={styles.sectionTitle}>
                                상품 승인/반려
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
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div className={styles.productContent}>
                                        <div className={styles.productImage}>
                                            <img src={product.image} alt={product.title} />
                                        </div>
                                        <div className={styles.productInfo}>
                                            <h3 className={styles.productTitle}>{product.title}</h3>
                                            <p className={styles.productDescription}>
                                                {product.description}
                                            </p>
                                            <div className={styles.companyInfo}>
                                                <img
                                                    src={product.company.logo}
                                                    alt={product.company.name}
                                                    className={styles.companyLogo}
                                                />
                                                <div className={styles.companyDetails}>
                            <span className={styles.companyName}>
                              {product.company.name}
                            </span>
                                                    <span className={styles.companyType}>
                              {product.company.type}
                            </span>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.productActions} style={{width:"265px"}}>
                                        {activeTab === "조회" ? (
                                            <>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={()=>setIsModalOpen(true)}
                                                >
                                                    <svg
                                                        width="12"
                                                        height="16"
                                                        viewBox="0 0 12 16"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M1 3H11M4 3V2C4 1.44772 4.44772 1 5 1H7C7.55228 1 8 1.44772 8 2V3M9.5 3V13C9.5 14.1046 8.60457 15 7.5 15H4.5C3.39543 15 2.5 14.1046 2.5 13V3H9.5Z"
                                                            stroke="white"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    삭제하기
                                                </button>
                                                <PopupModal
                                                    isOpen={isModalOpen}
                                                    onClose={() => setIsModalOpen(false)}
                                                    onDelete={handleDelete}
                                                    actionType="delete"
                                                    targetKeyword={product.title}
                                                />
                                            </>
                                        ):(
                                            <>
                                                <button className={styles.approveBtn} onClick={handleApprove}>
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M2 8L6 12L14 4"
                                                            stroke="white"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    승인하기
                                                </button>
                                                <button className={styles.rejectBtn} onClick={()=>setIsModalOpen(true)}>
                                                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10.6598 1.70664C11.0504 1.31602 11.0504 0.681641 10.6598 0.291016C10.2691 -0.0996094 9.63477 -0.0996094 9.24414 0.291016L5.95352 3.58477L2.65977 0.294141C2.26914 -0.0964844 1.63477 -0.0964844 1.24414 0.294141C0.853516 0.684766 0.853516 1.31914 1.24414 1.70977L4.53789 5.00039L1.24727 8.29414C0.856641 8.68476 0.856641 9.31914 1.24727 9.70977C1.63789 10.1004 2.27227 10.1004 2.66289 9.70977L5.95352 6.41602L9.24727 9.70664C9.63789 10.0973 10.2723 10.0973 10.6629 9.70664C11.0535 9.31602 11.0535 8.68164 10.6629 8.29102L7.36914 5.00039L10.6598 1.70664Z" fill="white"/>
                                                    </svg>
                                                    거절하기
                                                </button>
                                                <PopupModal
                                                    isOpen={isModalOpen}
                                                    onClose={() => setIsModalOpen(false)}
                                                    onDelete={handleReject}
                                                    actionType="productreject"
                                                    targetKeyword={product.title}
                                                />
                                            </>)}
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