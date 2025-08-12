"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import { IoIosNotifications, IoMdBusiness } from "react-icons/io";
import NavbarDropdown from "@/app/components/AlarmDropdown";

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  const navigation = [
    { name: "체험단", href: "/campaign" },
    { name: "펫 관리", href: "/user/management" },
    { name: "SNS 관리", href: "/sns" },
    { name: "건강 관리", href: "/health" },
    { name: "커뮤니티", href: "/community" },
  ];

  return (
    <>
      {/* Top Header */}
      <header className={styles.topHeader}>
        <div className="container">
          <div className={styles.topHeaderContent}>
            <div className={styles.leftSection}>
              <Link href="/" className={styles.logo}>
                <Image
                  src="/logo.png"
                  alt="PetFul Logo"
                  width={200}
                  height={200}
                />
              </Link>
            </div>

            <div className={styles.headerActions}>
              <Link href="/advertiser" className={styles.advertiserButton}>
                <IoMdBusiness size={25} />
                <span>광고주</span>
              </Link>
              <Link href="/user/login" className={styles.loginButton}>
                로그인
              </Link>
              <Link href="/user/signup" className={styles.signupButton}>
                회원가입
              </Link>
              <Link href="/user/mypage" className={styles.mypageButton}>
                <Image
                  src="/user/usericon.svg"
                  alt="마이페이지"
                  width={24} // 아이콘 크기
                  height={24}
                />
              </Link>
              <button className={styles.notificationButton}>
                <div
                  className={styles.notificationIcon}
                  onClick={toggleDropdown}
                >
                  <IoIosNotifications size={24} />
                </div>
                <span className={styles.notificationCount}>
                  {notificationCount}
                </span>
              </button>
              {isOpen && <NavbarDropdown open={isOpen} />}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Header */}
      <nav className={styles.navigation}>
        <div className="container">
          <div className={styles.navContent}>
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className={styles.navLink}>
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
