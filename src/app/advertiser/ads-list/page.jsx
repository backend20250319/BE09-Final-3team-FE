import SubHeader from "@/app/components/SubHeader";

export default function adsList() {

  return(
    <>
      <main style={{ flex: 1, padding: '64px 256px 0 144px' }}>
        <SubHeader
          title="체험단 광고 목록"
          subtitle="체험단 광고를 직접 등록하고 다양한 지원자들의 신청 현황을 한눈에 관리해보세요"
        />
      </main>
    </>
  );
}