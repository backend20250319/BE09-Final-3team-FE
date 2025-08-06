import React from "react";
import styles from "./PetstarModal.module.css";
import Image from "next/image";

const PetstarModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.title}>펫스타 신청</h2>
            <p className={styles.subtitle}>
              인증된 펫 인플루언서 프로그램에 지금 참여해보세요
            </p>
          </div>

          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <Image src="/user/medal.png" alt="Star" width={24} height={24} />
          <h3>펫스타 혜택</h3>

          <ul className={styles.benefitList}>
            <li>SNS 피드 분석을 통한 광고 자동 추천</li>
            <li>캠페인 목표에 부합하는 파트너 제안</li>
            <li>팔로워 수, 콘텐츠 반응 기반 광고 제안</li>
          </ul>
          <br />
          <h3>지원 기준</h3>
          <ul className={styles.criteriaList}>
            <li>팔로워 1K 이상</li>
            <li>좋아요 300개 이상인 게시물 3개 이상</li>
            <li>
              위 조건을 만족하면 펫스타로 활동할 수 있는 기회를 받을 수
              있습니다.
            </li>
          </ul>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.confirmButton}>신청하기</button>
          <button className={styles.cancelButton} onClick={onClose}>
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetstarModal;
