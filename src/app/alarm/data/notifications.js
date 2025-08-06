// data/notifications.js

const notifications = [
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
];

export default notifications;
