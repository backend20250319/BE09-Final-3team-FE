"use client";

import { usePathname } from "next/navigation";
import { FiUsers, FiList, FiUser } from "react-icons/fi";
import styles from "../styles/SideBar.module.css";

const Sidebar = () => {
  const pathname = usePathname();
  if (pathname === "/advertiser") {
    return null;
  }

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

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.userProfile}>
          <img
            src="/campaign/brand-1.jpg"
            alt="Advertiser"
            className={styles.avatar}
          />
          <div className={styles.userName}>PawsomeNutrition</div>
        </div>

        <nav className={styles.navigation}>
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`${styles.navItem} ${
                pathname === item.href ? styles.active : ""
              }`}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
