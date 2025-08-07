const campaigns = [
    {
      ad_no: 1,
      title: "유기농 반려동물 사료",
      content: 
`저희 프리미엄 유기농 반려동물 사료는 자연 그대로의 신선한 원재료만을 사용하여 만들어졌습니다. 
화학 첨가물이나 인공 색소, 인공 향미료는 일절 들어가지 않으며, 지역에서 공수한 유기농 곡물과 고단백 원료를 엄선해 반려동물의 건강한 식생활을 위한 최적의 밸런스를 추구합니다.
주요 원재료는 유기농 닭고기, 유기농 현미, 고구마, 완두콩, 치커리, 연어 오일 등 모두 USDA 인증 유기농 원료로만 구성되어 있습니다.
풍부한 단백질과 필수 아미노산, 오메가-3·6 지방산, 그리고 식이섬유가 함유되어 소화에 부담이 적으며, 면역력 향상과 건강한 피부·피모 유지에 도움을 줍니다.
글루텐 프리(Gluten-Free) 및 저알레르기 사료로, 알레르기를 유발할 수 있는 밀, 옥수수, 대두는 포함하지 않아 민감한 반려동물도 안심하고 급여할 수 있습니다.
전 제조 공정은 HACCP 및 국제 유기농 인증을 받은 시설에서 이루어지며, 모든 원료, 성분, 제조 이력은 투명하게 공개되어 믿을 수 있습니다.
또한, 저온 건조 공법과 자연의 풍미를 살린 레시피로 까다로운 입맛의 반려동물도 좋아하며, 뛰어난 신선도를 자랑합니다.
이 사료는 성장기부터 성견(성묘), 노령견(노령묘)까지 모든 라이프스테이지에서 균형 잡힌 영양을 제공해 반려동물이 더 건강하고 행복한 일상을 보낼 수 있도록 설계되었습니다.

추천 대상:
  - 건강 관리를 중요하게 생각하는 반려동물
  - 알레르기나 피부 트러블이 잦은 반려동물
  - 면역력 강화와 활력 증진이 필요한 모든 반려동물

자연을 담은 믿음직한 유기농 사료로 반려동물의 진짜 건강을 경험해보세요.`,
      objective: "새롭게 선보일 반려견 및 반려묘를 위한 프리미엄 유기농 사료를 급여해 볼 분을 모집합니다.",
      image: "/campaign/campaign-1.jpg",
      brand_url: "/campaign/brand-1.jpg",
      announce_start: "2025-08-01",
      announce_end: "2025-08-31",
      campaign_start: "",
      campaign_end: "",
      ad_status:"approved",
      applicant_status: null,
      statusText: "모집중",
      applicants: "45 / 100",
      brand: "PawsomeNutrition",
      description: "전 세계 반려동물에게 최고의 영양을 제공하기 위해 앞장서는 유기농 반려동물 사료 기업",
      created_at: null,
      mission: ['인스타그램 게시물 1개 작성', '인스타그램 스토리 1개 업로드', '상품 언박싱 비디오', '사료 주는 순간을 담은 사진'],
      keyword: ['#유기농 사료', '#프리미엄 사료', '#건강 사료', '#천연 재료', '#PawsomeNutrition'],
      requirement: ['강아지 또는 고양이 인플루언서', '최소 팔로워 수: 1K', '체험단 참여 횟수: 1회 이상']
    },
    {
      ad_no: 2,
      title: "친환경 고양이 모래 체험단 모집",
      content: "",
      objective: "친환경 소재로 만든 모래를 반려묘에게 사용하고 리뷰할 분을 모집합니다.",
      image: "/campaign-2.jpg",
      announce_start: "2025-08-05",
      announce_end: "2025-08-20",
      campaign_start: "",
      campaign_end: "",
      ad_status:"approved",
      applicant_status: "applied",
      applicants: "50 / 100",
      brand: "EcoCatCare",
      created_at: "2025-08-06"
    },
    {
      ad_no: 3,
      title: "반려동물 전용 샴푸 신제품 체험단",
      content: "",
      objective: "피부에 자극 없는 반려동물 전용 샴푸를 직접 사용해 보실 분을 모집합니다.",
      image: "/campaign-3.jpg",
      announce_start: "2025-07-10",
      announce_end: "2025-08-05",
      campaign_start: "",
      campaign_end: "",
      ad_status:"ended",
      applicant_status: "pending",
      applicants: "452 / 100",
      brand: "SoftPaws",
      created_at: "2025-08-03"
    },
    {
      ad_no: 4,
      title: "훈련용 장난감 체험단 모집",
      content: "",
      objective: "집중력 향상에 좋은 훈련용 장난감을 써보고 체험 소감을 공유해주실 분을 모집합니다.",
      image: "/campaign-4.jpg",
      announce_start: "2025-07-20",
      announce_end: "2025-07-30",
      campaign_start: "",
      campaign_end: "",
      ad_status:"ended",
      applicant_status: "selected",
      applicants: "183 / 30",
      brand: "PlaySmart",
      created_at: "2025-07-21"
    },
    {
      ad_no: 5,
      title: "천연 재료 반려동물 간식",
      content: "",
      objective: "반려동물에게 안전한 천연 재료로 만든 간식을 급여하고 리뷰해주실 분을 모집합니다.",
      image: "/campaign-5.jpg",
      announce_start: "2025-06-02",
      announce_end: "2025-06-12",
      campaign_start: "",
      campaign_end: "",
      ad_status:"ended",
      applicant_status: "rejected",
      applicants: "123 / 50",
      brand: "NaturalPetTreats",
      created_at: "2025-06-10"
    },
    {
      ad_no: 6,
      title: "강아지 영양식 체험단 모집",
      content: "",
      objective: "영양가 높은 반려견 식품을 급여하고 건강 개선 효과를 공유해줄 분을 모집합니다.",
      image: "/campaign-6.jpg",
      announce_start: "2025-05-01",
      announce_end: "2025-05-20",
      campaign_start: "",
      campaign_end: "",
      ad_status:"ended",
      applicant_status: "completed",
      applicants: "298 / 100",
      brand: "NutriPet",
      created_at: "2025-05-17"
    },
    {
      ad_no: 7,
      title: "말끔한 배변 패드 신제품 체험",
      content: "",
      objective: "흡수력 좋은 배변 패드를 직접 사용해보고 솔직한 리뷰를 남겨주실 분을 모집합니다.",
      image: "/campaign-7.jpg",
      announce_start: "2025-07-01",
      announce_end: "2025-07-31",
      campaign_start: "",
      campaign_end: "",
      ad_status:"ended",
      applicant_status: null,
      applicants: "251 / 100",
      brand: "FreshStep",
      created_at: null
    },
    {
      ad_no: 8,
      title: "스마트 목줄 출시 이벤트",
      content: "",
      objective: "최신 스마트 기능이 탑재된 목줄을 사용해보고 체험 후 의견을 남겨주실 분을 모집합니다.",
      image: "/campaign-8.jpg",
      announce_start: "2025-06-01",
      announce_end: "2025-06-30",
      campaign_start: "",
      campaign_end: "",
      ad_status:"ended",
      applicant_status: null,
      applicants: "478 / 100",
      brand: "TechPets",
      created_at: null
    }
  ];

  export default campaigns;