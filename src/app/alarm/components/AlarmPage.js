"use client";
import React, { useState } from "react";
import "../styles/AlarmPage.css";

const iconBasePath = "/icons/";

const PetFulNotification = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "새로운 캠페인이 출시되었습니다",
            message:
                "PawsomeNutrition에서 유기농 사료 라인을 홍보할 반려동물 인플루언서를 모집합니다. 지급:500-1000",
            time: "2시간 전",
            icon: "notification-icon.svg",
            iconColor: "orange",
            type: "notification",
        },
        {
            id: 2,
            title: "건강 알림",
            message:
                "버디의 월례 예방접종 검진 시간입니다. 예약하는 것을 잊지 마세요. 수의사에게.",
            time: "5시간 전",
            icon: "health-icon.svg",
            iconColor: "green",
            type: "health",
        },
        {
            id: 3,
            title: "소셜 미디어 성장",
            message:
                "좋은 소식이에요! 이번 주에 반려동물의 인스타그램 팔로워가 15%나 늘었어요. 앞으로도 좋은 소식 많이 들려주세요!",
            time: "1일 전",
            icon: "social-icon.svg",
            iconColor: "red",
            type: "social",
        },
        {
            id: 4,
            title: "커뮤니티 활동",
            message:
                "Sarah Johnson님이 반려동물 영양 팁에 대한 게시글에 댓글을 남겼습니다. 그녀의 댓글을 확인해 보세요!",
            time: "2일 전",
            icon: "community-icon.svg",
            iconColor: "blue",
            type: "community",
        },
        {
            id: 5,
            title: "캠페인 완료",
            message:
                "축하합니다! FunnyTails 인터랙티브 장난감 캠페인을 성공적으로 완료했습니다. 결제가 처리 중입니다.",
            time: "3일 전",
            icon: "campaign-icon.svg",
            iconColor: "purple",
            type: "campaign",
        },
        {
            id: 6,
            title: "예정된 약속",
            message:
                "알림: Luna는 내일 오후 2시에 PetGlam에서 미용 예약이 있습니다. 살론",
            time: "1주 전",
            icon: "appointment-icon.svg",
            iconColor: "green",
            type: "appointment",
        },
    ]);

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
