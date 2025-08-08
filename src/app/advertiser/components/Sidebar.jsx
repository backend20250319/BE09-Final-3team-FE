"use client"; // 클라이언트 컴포넌트로 지정

import { usePathname } from "next/navigation";
import { FiUsers, FiList, FiUser } from "react-icons/fi";
import styles from "../styles/SideBar.module.css";

const Sidebar = ({ activeTab = "profile" }) => {
  const pathname = usePathname();
  if (pathname === "/advertiser") {
    return null;
  }

  const navigationItems = [
    {
      id: "petstar",
      label: "펫스타 목록",
      icon: <FiUsers className={styles.navIcon} />,
      href: "/petstar-list",
    },
    {
      id: "ads",
      label: "체험단 광고 목록",
      icon: <FiList className={styles.navIcon} />,
      href: "/ads-list",
    },
    {
      id: "profile",
      label: "프로필 관리",
      icon: <FiUser className={styles.navIcon} />,
      href: "/admin/profile",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.userProfile}>
          <img
            src="/images/profile-avatar.jpg"
            alt="John Advertiser"
            className={styles.avatar}
          />
          <div className={styles.userName}>John Advertiser</div>
        </div>

        <nav className={styles.navigation}>
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`${styles.navItem} ${
                activeTab === item.id ? styles.active : ""
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
