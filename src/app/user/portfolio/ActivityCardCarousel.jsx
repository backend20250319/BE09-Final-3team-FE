"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./Portfolio.module.css";

export default function ActivityCardCarousel({
  activityCards,
  onCardClick,
  onEditActivity,
}) {
  const cardsContainerRef = useRef(null);

  // 드래그 스크롤 상태
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    if (!cardsContainerRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - cardsContainerRef.current.offsetLeft);
    setScrollLeft(cardsContainerRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDown(false);
  const onMouseUp = () => setIsDown(false);

  const onMouseMove = (e) => {
    if (!isDown || !cardsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - cardsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // 속도
    cardsContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const onWheel = (e) => {
    if (!cardsContainerRef.current) return;
    cardsContainerRef.current.scrollLeft += e.deltaY;
  };

  return (
    <div className={styles.cardsWrapper}>
      {/* 좌측 버튼 */}
      <button
        className={styles.navButton}
        onClick={() => {
          if (cardsContainerRef.current) {
            cardsContainerRef.current.scrollLeft -= 450;
          }
        }}
      >
        <Image
          src="/user/down.png"
          alt="이전"
          width={24}
          height={24}
          style={{ transform: "rotate(90deg)" }}
        />
      </button>

      {/* 카드 리스트 */}
      <div
        className={styles.activityCardsContainer}
        ref={cardsContainerRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
      >
        <div className={styles.activityCards}>
          {activityCards.map((card) => (
            <div
              key={card.id}
              className={styles.activityCard}
              onClick={() => onCardClick?.(card)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.cardImage}>
                {card.image &&
                card.image.trim() !== "" &&
                card.image !== "undefined" ? (
                  <Image
                    src={card.image}
                    alt={`활동 이미지 ${card.id}`}
                    layout="fill"
                    objectFit="cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 이미지로 대체
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={styles.imagePlaceholder}
                  style={{
                    display:
                      !card.image ||
                      card.image.trim() === "" ||
                      card.image === "undefined"
                        ? "flex"
                        : "none",
                  }}
                >
                  <Image
                    src="/user/upload.svg"
                    alt="이미지 업로드"
                    width={43}
                    height={31}
                  />
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardForm}>
                  <div className={styles.formRow}>
                    <div className={styles.labelWithEdit}>
                      <label>활동 제목</label>
                      <button
                        className={styles.editButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditActivity?.(card);
                        }}
                      >
                        <Image
                          src="/user/edit.png"
                          alt="편집"
                          width={16}
                          height={16}
                        />
                      </button>
                    </div>
                    <div className={styles.readOnlyText}>{card.title}</div>
                  </div>

                  <div className={styles.formRow}>
                    <label>활동 시기</label>
                    <div className={styles.readOnlyText}>{card.period}</div>
                  </div>

                  <div className={styles.formRow}>
                    <label>활동 내용</label>
                    <div className={styles.readOnlyText}>
                      {card.content && card.content.length > 30
                        ? `${card.content.substring(0, 30)}...`
                        : card.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 우측 버튼 */}
      <button
        className={styles.navButton}
        onClick={() => {
          if (cardsContainerRef.current) {
            cardsContainerRef.current.scrollLeft += 450;
          }
        }}
      >
        <Image
          src="/user/down.png"
          alt="다음"
          width={24}
          height={24}
          style={{ transform: "rotate(-90deg)" }}
        />
      </button>
    </div>
  );
}
