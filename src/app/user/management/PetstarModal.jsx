import React from "react";
import styles from "./PetstarModal.module.css";
import Image from "next/image";

const PetstarModal = ({ isOpen, onClose, selectedPet, onApply }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <div className={styles.starIcon}>
                <Image src="/user/star.svg" alt="Star" width={18} height={18} />
              </div>
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>펫스타 신청</h2>
              <p className={styles.subtitle}>
                인증된 펫 인플루언서 프로그램에 지금 참여해보세요
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <Image
              src="/icons/close-icon.svg"
              alt="Close"
              width={14}
              height={14}
            />
          </button>
        </div>

        {/* Body Section */}
        <div className={styles.modalBody}>
          {/* Benefits Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>펫스타 혜택</h3>
              <Image src="/user/medal.png" alt="Star" width={18} height={18} />
            </div>
            <ul className={styles.benefitList}>
              <li>
                <Image
                  src="/user/infoicon.svg"
                  alt="Info"
                  width={16}
                  height={16}
                  className={styles.infoIcon}
                />
                SNS 피드 분석을 통한 광고 자동 추천
              </li>
              <li>
                <Image
                  src="/user/infoicon.svg"
                  alt="Info"
                  width={16}
                  height={16}
                  className={styles.infoIcon}
                />
                브랜드 이미지·캠페인 목적에 부합하는 적합한 파트너 제안
              </li>
              <li>
                <Image
                  src="/user/infoicon.svg"
                  alt="Info"
                  width={16}
                  height={16}
                  className={styles.infoIcon}
                />
                팔로워 수, 콘텐츠 반응, 피드 스타일 등 다양한 요소를 고려한
                펫스타 전용 광고 제안 제공
              </li>
            </ul>
          </div>

          {/* Criteria Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>지원 기준</h3>
            </div>
            <ul className={styles.criteriaList}>
              <li>팔로워 1K 이상</li>
              <li>좋아요 300개 이상인 게시물 3개 이상</li>
              <li>
                위 조건을 만족하면 펫스타로 활동할 수 있는 기회를 받을 수
                있습니다.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Section */}
        <div className={styles.modalFooter}>
          <button
            className={styles.confirmButton}
            onClick={() => {
              if (selectedPet && onApply) {
                onApply(selectedPet.petNo);
              }
            }}
          >
            <Image src="/user/plane.svg" alt="Plane" width={20} height={20} />
            신청하기
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetstarModal;
