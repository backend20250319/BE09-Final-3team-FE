"use client";

import React, { useState } from "react";
import styles from "./PetProfile.module.css";
import Image from "next/image";
import PetProfileRegistration from "./PetProfileRegistration";
import PetstarModal from "./PetstarModal";
import Link from "next/link";

const PetProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPetstarModalOpen, setIsPetstarModalOpen] = useState(false);

  const pets = [
    {
      id: 1,
      name: "황금이",
      breed: "골든 리트리버",
      age: "3살",
      health: "Healthy",
      description:
        "장난기 많고 에너지가 넘칩니다. 공놀이와 해변에서 수영하는 것을 좋아합니다.",
      image: "/user/dog.png",
      healthPercentage: 100,
      healthColor: "#8BC34A",
      isPetStar: true, // 펫스타 상태 추가
    },
    {
      id: 2,
      name: "루나",
      breed: "샴 고양이",
      age: "2살",
      health: "Healthy",
      description: "독립적이고 우아한 성격입니다.",
      image: "/user/cat.png",
      healthPercentage: 85,
      healthColor: "#F5A623",
      isPetStar: false, // 펫스타가 아닌 경우
    },
    {
      id: 3,
      name: "찰리",
      breed: "푸른 마코 앵무",
      age: "5살",
      health: "건강 검진 예정",
      description: "수다스럽고 사교적인 성격입니다.",
      image: "/user/bird.png",
      healthPercentage: 60,
      healthColor: "#FF7675",
      isPetStar: false, // 펫스타가 아닌 경우
    },
  ];

  const hasPets = pets.length > 0;

  return (
    <div className={styles.container}>
      {!hasPets ? (
        <section className={styles.headerSectionEmpty}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>펫 프로필</h1>
            <h1 className={styles.mainTitle}>
              반려동물의 모든 정보를 한곳에 관리하세요
            </h1>
            <p className={styles.mainDescription}>
              사진, 건강 기록, 성격 특성 등 반려동물의 프로필을 자세히 작성하고
              정리할 수 있습니다. 필요한 모든 정보를 아름답고 체계적인 공간에서
              관리해보세요.
            </p>
            <button
              className={styles.createButton}
              onClick={() => setIsModalOpen(true)}
            >
              첫 번째 프로필 만들기
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className={styles.headerSection}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>펫 프로필</h1>
              <h1 className={styles.mainTitle}>
                반려동물의 모든 정보를 한곳에 관리하세요
              </h1>
              <p className={styles.mainDescription}>
                사진, 건강 기록, 성격 특성 등 반려동물의 프로필을 자세히
                작성하고 정리할 수 있습니다. 필요한 모든 정보를 아름답고
                체계적인 공간에서 관리해보세요.
              </p>
            </div>
          </section>

          <section className={styles.mainSection}>
            <div className={styles.contentWrapper}>
              <div className={styles.header}>
                <div className={styles.titleSection}>
                  <h2 className={styles.sectionTitle}>반려동물 프로필</h2>
                  <p className={styles.sectionDescription}>
                    반려동물의 모든 정보를 관리하고 확인하세요
                  </p>
                </div>

                <div className={styles.searchFilterSection}>
                  <div className={styles.searchContainer}>
                    <div className={styles.searchIcon}>
                      <Image
                        src="/user/search.png"
                        alt="Search"
                        width={16}
                        height={16}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Search pets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>

                  <div className={styles.filterContainer}>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="All Types">All Types</option>
                      <option value="Dogs">Dogs</option>
                      <option value="Cats">Cats</option>
                      <option value="Birds">Birds</option>
                    </select>
                    <div className={styles.dropdownIcon}>
                      <Image
                        src="/user/down.png"
                        alt="Dropdown"
                        width={12}
                        height={7}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.petGrid}>
                {pets.map((pet) => (
                  <div key={pet.id} className={styles.petCard}>
                    <div className={styles.petImageContainer}>
                      <Link
                        href={`/user/portfolio`} // 포트폴리오 페이지 경로 ${pet.id} 나중에 pet.id 추가
                        aria-label={`${pet.name} 포트폴리오로 이동`}
                      >
                        <div className={styles.petImage}>
                          <Image
                            src={pet.image}
                            alt={pet.name}
                            width={409}
                            height={192}
                            className={styles.petImage}
                          />
                        </div>
                      </Link>
                      <div
                        className={styles.healthBadge}
                        style={{ backgroundColor: pet.healthColor }}
                      >
                        {pet.healthPercentage}%
                      </div>
                    </div>

                    <div className={styles.petInfo}>
                      <div className={styles.petHeader}>
                        <div className={styles.petNameBreedRow}>
                          <span className={styles.petName}>{pet.name}</span>
                          <span className={styles.breedText}>
                            ({pet.breed})
                          </span>
                          {pet.isPetStar && (
                            <Image
                              src="/user/medal.svg"
                              alt="PetStar"
                              width={20}
                              height={18}
                              className={styles.petStarBadge}
                            />
                          )}
                        </div>

                        <div className={styles.petMetaRow}>
                          <div className={styles.healthInfo}>
                            <Image
                              src="/user/heartVec.png"
                              alt="Health"
                              width={16}
                              height={16}
                              className={styles.healthIcon}
                            />
                            <span className={styles.healthText}>
                              {pet.health}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.ageText}>{pet.age}</div>

                      <div className={styles.petDescription}>
                        {pet.description}
                      </div>

                      <div className={styles.petFooter}>
                        <div className={styles.petActions}>
                          {!pet.isPetStar && (
                            <button
                              className={styles.actionButton}
                              onClick={() => setIsPetstarModalOpen(true)}
                            >
                              <Image
                                src={`/user/medal.png`}
                                alt="Medal"
                                width={18}
                                height={18}
                              />
                            </button>
                          )}
                          <button
                            className={styles.actionButton}
                            onClick={() => setIsModalOpen(true)}
                          >
                            <Image
                              src="/user/edit.png"
                              alt="Edit"
                              width={16}
                              height={16}
                            />
                          </button>
                          <button
                            className={styles.actionButton}
                            onClick={() => setIsDeleteModalOpen(true)}
                          >
                            <Image
                              src="/user/garbage.png"
                              alt="Delete"
                              width={14}
                              height={16}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className={styles.addPetCard}
                  onClick={() => setIsModalOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.addPetIcon}>
                    <Image
                      src="/user/plusVec.png"
                      alt="Add Pet"
                      width={23}
                      height={21}
                    />
                  </div>
                  <h3 className={styles.addPetTitle}>Add New Pet</h3>
                  <p className={styles.addPetDescription}>
                    Create a profile for your new family member
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 펫 프로필 등록 모달 */}
      <PetProfileRegistration
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h1 className={styles.title}>삭제하시겠습니까?</h1>
              <button
                className={styles.closeButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div
              className={styles.modalFooter}
              style={{ display: "flex", justifyContent: "center", gap: "16px" }}
            >
              <button
                className={styles.deleteButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                삭제
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 펫스타 신청 모달 */}
      <PetstarModal
        isOpen={isPetstarModalOpen}
        onClose={() => setIsPetstarModalOpen(false)}
      />
    </div>
  );
};

export default PetProfile;
