"use client";

import React, { useState } from 'react';
import Image from "next/image";
import styles from "../styles/PetProfile.module.css"
import AdditinalSection from './AdditionalSection';
import ActivityHistory from './ActivityHistory';
import ActivityDetailModal from '@/app/user/portfolio/ActivityDetailModal';
import activities from '../data/ActivityData';

export default function PetProfile() {

  const [selectedPet, setSelectedPet] = useState('황금이');

  const petData = {
    황금이: {
      name: '황금이',
      breed: '골든 리트리버',
      age: '3살',
      weight: '28 kg',
      gender: 'M',
      personality: '황금이는 매우 친근하고 사교적인 성격으로, 사람뿐 아니라 다른 반려동물과도 쉽게 친해집니다. 긍정적인 에너지와 활발한 호기심으로 언제나 주변 분위기를 밝게 만드는 친구입니다. 상황에 따라 차분함과 활동성을 유연하게 조절하는 균형 잡힌 성격을 가지고 있어 다양한 환경에 잘 적응합니다.',
      introduction: '모험을 사랑하는 황금이는 해변 산책과 산악 하이킹 코스를 즐기며 자연 속에서 뛰노는 걸 가장 좋아합니다. 친구들과 어울려 뛰어노는 것을 즐기며, 특히 어린이와 다른 반려동물들과 따뜻한 교감을 나누는 모습을 자주 볼 수 있습니다. 신뢰감 있고 충성스러운 성향 덕분에 가족들의 든든한 친구이자 보호자로도 사랑받고 있습니다.',
      image: '/user/dog.png',
      instagram: '@goldenbuddy',
      followers: '189K',
      price: '250,000',
      partcipation: 10
    },
    루나: {
      name: '루나',
      breed: '샴 고양이',
      age: '2살',
      weight: '4 kg',
      gender: 'F',
      personality: '루나는 조용하면서도 우아한 분위기를 자아내며, 섬세하고 예민한 감성을 가진 반려묘입니다. 자신의 공간을 소중히 여기면서도 신뢰하는 사람에게는 애정이 넘치는 모습을 보여줍니다. 차분하고 지적인 성격으로 주변을 관찰하며 필요한 순간에만 슬쩍 다가오는 매력적인 친구입니다.',
      introduction: '창가 햇살 아래에서 평화로운 시간을 보내는 것을 좋아하는 루나는 우아하고 세련된 생활 방식을 지니고 있습니다. 때로는 호기심 가득한 모습을 보이지만, 기본적으로는 조용하고 안정적인 환경에서 가장 행복해합니다. 주인의 손길을 즐기며, 부드러운 울음과 부드러운 털결로 마음을 편안하게 해주는 특별한 존재입니다.',
      image: '/user/cat.png',
      instagram: '@luna_cat',
      followers: "180K",
      cost: "₩250,000",
      partcipation: 8
    },
    찰리: {
      name: '찰리',
      breed: '푸른 마코 앵무',
      age: '5살',
      weight: '1 kg',
      gender: 'M',
      personality: '찰리는 활기차고 호기심 많은 앵무새로, 지적이고 사교적인 성격을 가지고 있습니다. 빠르게 배우는 능력과 재치로 주인과 주변 사람들을 즐겁게 하며, 새로운 도전을 두려워하지 않습니다. 또한 자신의 감정을 다양한 소리와 행동으로 표현하는 다채로운 성격의 소유자입니다.',
      introduction: '찰리는 공놀이나 장난감을 가지고 노는 것을 무척 좋아하며, 산책처럼 직접 야외에서의 경험도 즐깁니다. 밝고 명랑한 성격 덕분에 주위에 활력을 불어넣고, 쉽게 친해질 수 있는 친구이기도 합니다. 일상의 소소한 순간들도 찰리와 함께하면 즐거움 가득한 추억이 됩니다.',
      image: '/user/bird.png',
      instagram: '@max_dog',
      followers: "30K",
      cost: "₩100,000",
      partcipation: 5
    }
  };

  const [activityCards, setActivityCards] = useState(activities);

  const selectedPetInfo = petData[selectedPet];

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleCardClick = (card) => {
    setSelectedActivity(card);
    setIsDetailModalOpen(true);
  };

  return(
    <div className={styles.profileSection}>
      {/* Pet Selector */}
      <div className={styles.petSelector}>
        {Object.entries(petData).map(([id, pet]) => (
          <button
            key={id}
            className={`${styles.petTab} ${selectedPet === id ? styles.active : ''}`}
            onClick={() => setSelectedPet(id)}
          >
            <Image src={pet.image} alt={pet.name} width={24} height={24} className={styles.petImage} />
            <span>{pet.name}</span>
          </button>
        ))}
      </div>
      {/* Pet Profile Card */}
      <div className={styles.petProfileCard}>
        <div className={styles.petHeader}>
          <div className={styles.petImageContainer}>
            <Image 
              src={selectedPetInfo.image} 
              alt={selectedPetInfo.name} 
              width={128} 
              height={128}
              className={styles.petProfileImage}
            />
          </div>
          <div className={styles.petInfo}>
            <div className={styles.petDetail}>
              <h3 className={styles.petName}>{selectedPetInfo.name}</h3>
              <div className={styles.instagramSection}>
                <Image
                  src="/campaign/instagram.png"
                  alt="instagram.png"
                  width={16}
                  height={16} />
                <span className={styles.instagramHandle}>{selectedPetInfo.instagram}</span>
              </div>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>품종:</span>
                <span className={styles.detailValue}>{selectedPetInfo.breed}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>나이:</span>
                <span className={styles.detailValue}>{selectedPetInfo.age}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>무게:</span>
                <span className={styles.detailValue}>{selectedPetInfo.weight}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>성별:</span>
                <span className={styles.detailValue}>{selectedPetInfo.gender}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <div className={styles.activityContent}>
          <h4 className={styles.activityTitle}>활동 이력</h4>
          <ActivityHistory activityCards={activityCards} onCardClick={handleCardClick} />
          <ActivityDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            activityData={selectedActivity}/>
        </div>

        <div className={styles.petDescription}>
          <h4 className={styles.descriptionTitle}>간단한 소개</h4>
          <p className={styles.descriptionText}>{selectedPetInfo.introduction}</p>
        </div>

        <div className={styles.petPersonality}>
          <h4 className={styles.personalityTitle}>성격</h4>
          <p className={styles.personalityText}>{selectedPetInfo.personality}</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#F5A623' }}>{selectedPetInfo.followers}</div>
            <div className={styles.statLabel}>팔로워 수</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#FF7675' }}>{selectedPetInfo.cost}</div>
            <div className={styles.statLabel}>단가</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#8BC34A' }}>{selectedPetInfo.partcipation}</div>
            <div className={styles.statLabel}>체험단 참여 횟수</div>
          </div>
        </div>

        <div className={styles.ownerInfo}>
          <h4 className={styles.ownerTitle}>반려인 정보</h4>
          <div className={styles.ownerProfile}>
            <Image src="/campaign/profile.png" alt="Owner" width={48} height={48} className={styles.ownerImage} />
            <div className={styles.ownerDetails}>
              <h5 className={styles.ownerName}>정승원</h5>
              <p className={styles.ownerIntro}>
                안녕하세요!
                골든 리트리버 ‘황금이’, 샴 고양이 ‘루나’, 푸른 마코 앵무 ‘찰리’와 함께하는 인플루언서 정승원입니다.
                저는 반려동물과 함께하는 일상 속에서 다양한 상품과 서비스를 체험하고, 그 경험을 진솔하고 생생하게 전달하는 것을 주 컨텐츠로 삼고 있습니다.
                특히 펫 전용 제품 리뷰, 체험단 활동, 반려동물과의 라이프스타일 콘텐츠를 통해 많은 분들이 반려동물과의 삶을 더 풍성하게 즐길 수 있도록 돕고 있습니다.
              </p>
            </div>
          </div>
          <div className={styles.ownerContact}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>이메일:</span>
              <span className={styles.contactValue}>petlover123@email.com</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>전화번호:</span>
              <span className={styles.contactValue}>010-1234-5678</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>주소:</span>
              <span className={styles.contactValue}>서울특별시 강남구</span>
            </div>
          </div>
        </div>
      </div>

      <AdditinalSection />
    </div>
  );
}