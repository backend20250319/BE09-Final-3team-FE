"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../styles/Header.module.css";
import Link from "next/link";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  const navigation = [
    { name: "체험단", href: "#campaigns" },
    { name: "펫 관리", href: "#pet-management" },
    { name: "SNS 관리", href: "/sns" },
    { name: "건강 관리", href: "/health/activity" },
    { name: "커뮤니티", href: "#community" },
  ];

  return (
    <>
      {/* Top Header */}
      <header className={styles.topHeader}>
        <div className="container">
          <div className={styles.topHeaderContent}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo.png"
                alt="PetFul Logo"
                width={200}
                height={200}
              />
            </Link>

            <div className={styles.headerActions}>
              <button className={styles.cartButton}>
                <div className={styles.cartIcon}>
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                    <path
                      d="M3 1L1 5V19C1 19.55 1.45 20 2 20H16C16.55 20 17 19.55 17 19V5L15 1H3Z"
                      stroke="#594A3E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M12 9C12 10.66 10.66 12 9 12C7.34 12 6 10.66 6 9"
                      stroke="#594A3E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
                <span className={styles.cartCount}>{cartCount}</span>
              </button>

              <button className={styles.loginButton}>Login</button>

              <button className={styles.signupButton}>Sign Up</button>
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
