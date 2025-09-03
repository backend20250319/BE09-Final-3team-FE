"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiUsers, FiList, FiUser } from "react-icons/fi";
import styles from "../styles/SideBar.module.css";
import { getAdvertiser, getFileByAdvertiserNo } from "@/api/advertiserApi";
import { useImage } from "../context/ImageContext";
import LoginRequiredModal from "@/components/LoginRequiredModal";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  if (pathname === "/advertiser") {
    return null;
  }

  const { imageVersion } = useImage();

  const navigationItems = [
    {
      id: "ads",
      label: "체험단 광고 목록",
      icon: <FiList className={styles.navIcon} />,
      href: "/advertiser/ads-list",
    },
    {
      id: "petstar",
      label: "펫스타 목록",
      icon: <FiUsers className={styles.navIcon} />,
      href: "/advertiser/petstar-list",
    },
    {
      id: "profile",
      label: "프로필 관리",
      icon: <FiUser className={styles.navIcon} />,
      href: "/advertiser/profile",
    },
  ];

  const [companyData, setCompanyData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const DEFAULT_IMAGE_URL = `http://dev.macacolabs.site:8008/3/advertiser/images/default_brand.png`;

  // 광고주 로그인 상태 확인
  const isAdvertiserLoggedIn = () => {
    if (typeof window === "undefined") return false;

    const advertiserToken = localStorage.getItem("advertiserToken");
    const advertiserId = localStorage.getItem("advertiserId");

    return !!(advertiserToken && advertiserId);
  };

  // 네비게이션 클릭 핸들러
  const handleNavigationClick = (e, serviceName, href) => {
    if (!isAdvertiserLoggedIn()) {
      e.preventDefault();
      setSelectedService(serviceName);
      setShowLoginModal(true);
      return;
    }
    // 로그인된 경우 정상적으로 이동
    router.push(href);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setSelectedService("");
  };

  const loadProfileImage = async () => {
    try {
      const fileData = await getFileByAdvertiserNo();

      if (
        fileData && 
        fileData[0]?.filePath &&
        fileData[0]?.filePath.trim() !== ""
      ) {
        setPreviewImage(fileData[0].filePath);
        setIsLoadingImage(false);
      } else {
        setPreviewImage(DEFAULT_IMAGE_URL);
        setIsLoadingImage(false);
      }
    } catch (error) {
      console.error("Failed to load profile image:", error);
      setPreviewImage(DEFAULT_IMAGE_URL);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdvertiser();
        setCompanyData(data);
      } catch (error) {
        console.error("Failed to get advertiser profile:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    loadProfileImage();
  }, [imageVersion]);

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.userProfile}>
            {isLoadingImage ? (
              <div></div>
            ) : (
              <>
                <img
                  src={previewImage || DEFAULT_IMAGE_URL}
                  alt="Advertiser"
                  className={styles.avatar}
                />
                <div className={styles.userName}>{companyData?.name}</div>
              </>
            )}
          </div>

          <nav className={styles.navigation}>
            {navigationItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`${styles.navItem} ${
                  pathname.includes(item.href) ? styles.active : ""
                }`}
                onClick={(e) => handleNavigationClick(e, item.label, item.href)}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* 로그인 필요 모달 */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        serviceName={selectedService}
      />
    </>
  );
};

export default Sidebar;
