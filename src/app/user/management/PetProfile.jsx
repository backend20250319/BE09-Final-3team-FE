"use client";

import React, { useState } from "react";
import styles from "./PetProfile.module.css";
import Image from "next/image";

const PetProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");

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
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <section className={styles.headerSection}>
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
          <button className={styles.createButton}>첫 번째 프로필 만들기</button>
        </div>
      </section>

      {/* Main Content Section */}
      <section className={styles.mainSection}>
        <div className={styles.contentWrapper}>
          {/* Header with Search and Filter */}
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

          {/* Pet Cards Grid */}
          <div className={styles.petGrid}>
            {/* Existing Pet Cards */}
            {pets.map((pet) => (
              <div key={pet.id} className={styles.petCard}>
                <div className={styles.petImageContainer}>
                  <div className={styles.petImage}>
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      width={409}
                      height={192}
                      className={styles.petImage}
                    />
                  </div>
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
                      <span className={styles.breedText}>({pet.breed})</span>
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
                        <span className={styles.healthText}>{pet.health}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.ageText}>{pet.age}</div>

                  <div className={styles.petDescription}>{pet.description}</div>

                  <div className={styles.petFooter}>
                    <div className={styles.petActions}>
                      <button className={styles.actionButton}>
                        <Image
                          src={`/user/medal.png`}
                          alt="Medal"
                          width={18}
                          height={18}
                        />
                      </button>
                      <button className={styles.actionButton}>
                        <Image
                          src="/user/edit.png"
                          alt="Edit"
                          width={16}
                          height={16}
                        />
                      </button>
                      <button className={styles.actionButton}>
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
            {/* Add New Pet Card */}
            <div className={styles.addPetCard}>
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
    </div>
  );
};

export default PetProfile;
