import Head from "next/head";
import CampaignListPage from "./components/CampaignListPage";

export default function Home() {
  return (
    <>
      <Head>
        <title>체험단 상품 목록 - PetFul</title>
        <meta
          name="description"
          content="반려동물과 함께하는 특별한 상품 체험, 지금 바로 신청하고 경험해보세요."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <CampaignListPage />
    </>
  );
}
