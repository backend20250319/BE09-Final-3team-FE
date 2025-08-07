"use client";

import { useState } from "react";
import PetProfileRegistration from "./PetProfileRegistration";
import styles from "./PetProfileManagement.module.css";

const PetProfileManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>반려동물 프로필 관리</h1>
        <button className={styles.addButton} onClick={handleOpenModal}>
          <img 
            src="/user/plusVec.png" 
            alt="Add" 
            className={styles.addIcon}
          />
          반려동물 추가하기
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.emptyState}>
          <img 
            src="/user/dog.png" 
            alt="Pet" 
            className={styles.emptyImage}
          />
          <p className={styles.emptyText}>
            아직 등록된 반려동물이 없습니다.
            <br />
            반려동물을 추가해보세요!
          </p>
        </div>
      </div>

      <PetProfileRegistration 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default PetProfileManagement; 