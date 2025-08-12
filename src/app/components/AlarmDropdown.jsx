import React from "react";
import styles from "../styles/AlarmDropdown.module.css";
import notifications from "@/app/alarm/data/notifications";
import {useRouter} from "next/navigation";

const iconBasePath = "/icons/";

export default function NavbarDropdown({
  open,
  onViewAll,
}) {
  if (!open) return null;
  const router = useRouter();
  const handleAlarm =  () => {
      router.push('/alarm');
    }
  return (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        <span className={styles.title}>알림</span>
      </div>
      <div className={styles.list} onClick={handleAlarm} style={{cursor:"pointer"}}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>알림이 없습니다.</div>
        ) : (
          notifications.slice(0,5).map((item, idx) => (
            <div className={styles.item} key={idx}>
              <div
                className={
                  styles.iconContainer + " " + (styles[item.iconColor] || "")
                }
              >
                {item.icon && (
                    <div className={`icon-container ${item.iconColor}`}>
                        <img
                            src={`${iconBasePath}${item.icon}`}
                            alt={item.type}
                            className="icon"
                        />
                    </div>
                )}
              </div>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' ,textAlign:'left'}}>
              <div className={styles.textContent}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.message}>{item.message}</div>
              </div>
                <div className={styles.time}>{item.time}</div>
              </div>

            </div>
          ))
        )}
      </div>
      <div className={styles.footer}>
      </div>
    </div>
  );
}
