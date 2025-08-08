"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import styles from "./styles/SideBar.module.css";
import Header from "./components/Header";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/advertiser") {
    return (
      <>
        <Header />
        <div>{children}</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        {children}
      </div>
    </>
  );
}
