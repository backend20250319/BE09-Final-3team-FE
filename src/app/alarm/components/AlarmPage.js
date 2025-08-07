"use client";
import React, { useState } from "react";
import "../styles/AlarmPage.css";
import initialNotifications from "../data/notifications";

const iconBasePath = "/icons/";

const PetFulNotification = () => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const handleCloseNotification = (id) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
        );
    };

    const handleMoreNotifications = () => {
        console.log("더 많은 알림을 로드합니다...");
    };

    return (
        <div className="petful-container">
            <div className="notification-card">
                {/* Header */}
                <div className="header">
                    <h1 className="title">알림</h1>
                    <p className="subtitle">최신 활동 소식을 받아보세요.</p>
                </div>

                {/* Notification List */}
                <div className="notification-list">
                    {notifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            className={`notification-item ${index === 0 ? "first-item" : ""}`}
                        >
                            <div className="notification-content">
                                <div className={`icon-container ${notification.iconColor}`}>
                                    <img
                                        src={`${iconBasePath}${notification.icon}`}
                                        alt={notification.type}
                                        className="icon"
                                    />
                                </div>
                                <div className="text-content">
                                    <h3 className="notification-title">{notification.title}</h3>
                                    <p className="notification-message">{notification.message}</p>
                                    <span className="notification-time">{notification.time}</span>
                                </div>
                            </div>
                            <button
                                className="close-btn"
                                onClick={() => handleCloseNotification(notification.id)}
                                aria-label="알림 닫기"
                            >
                                <img src={`${iconBasePath}close-icon.svg`} alt="닫기" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="footer">
                    <button className="more-btn" onClick={handleMoreNotifications}>
                        더보기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PetFulNotification;
