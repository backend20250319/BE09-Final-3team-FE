"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import styles from "./styles/SideBar.module.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/advertiser") {
    return <div>{children}</div>;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      {children}
    </div>
  );
}
