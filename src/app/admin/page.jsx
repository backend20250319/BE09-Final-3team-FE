'use client';
import AdminSideBar from "@/app/admin/components/AdminSideBar";
import AdminHeader from "@/app/admin/components/AdminHeader";
import styles from "@/app/admin/styles/ProductManagement.module.css";
import AdminMainContent from "@/app/admin/components/AdminMainContent";
import {useState} from "react";

export default function AdminHome(){
    const [activeSidebar,setActiveSidebar] = useState("상품 관리");
    return(
        <div className={styles.container}>
        <AdminHeader/>
        <div className={styles.mainContent}>
        <AdminSideBar activeSidebar = {activeSidebar} setActiveSidebar={setActiveSidebar}/>
        <AdminMainContent activeSidebar={activeSidebar}/>
        </div>
        </div>
    )
}

