import styles from "../styles/CampaignDetail.module.css"
import Image from "next/image";

export default function CampaignDetail({ campaignData }) {

  return (
    <div className={styles.campaignDetail}>
      {/* 상품 상세 정보 */}
      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>상품 상세 정보</h3>
        <div className={styles.sectionContent}>
          <p className={styles.productDescription}>
            {campaignData.content}
          </p>
        </div>
      </section>

      {/* 체험단 미션 */}
      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>체험단 미션</h3>
        <div className={styles.sectionContent}>
          <div className={styles.missionList}>
            <div className={styles.missionGoal}>
              <div className={styles.goalIcon}>
                <Image
                  src="/campaign/target.png"
                  alt="target.png"
                  width={18}
                  height={18} />
              </div>
              <div className={styles.goalContent}>
                <h4 className={styles.goalTitle}>주요 목표</h4>
                <p className={styles.goalDescription}>
                  {campaignData.objective}
                </p>
              </div>
            </div>
            {campaignData.mission.map((mission, index) => (
              <div key={mission.missionNo || index} className={styles.missionItem}>
                <div className={styles.missionIcon}>
                  <Image
                    src="/campaign/check.png"
                    alt="check.png"
                    width={16}
                    height={16} />
                </div>
                <span className={styles.missionText}>{mission.content}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 필수 키워드 */}
      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>필수 키워드</h3>
        <div className={styles.sectionContent}>
          <p className={styles.keywordDescription}>
            리뷰 게시글에 다음 키워드를 포함해 주세요 :
          </p>
          <div className={styles.keywordTags}>
            {campaignData.keyword.map((keyword, index) => (
              <span key={keyword.keywordNo || index} className={styles.keywordTag}>
                {keyword.content}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 필수 요건 */}
      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>필수 요건</h3>
        <div className={styles.sectionContent}>
          <ul className={styles.requirementsList}>
            {campaignData.requirement.map((requirement, index) => (
              <li key={requirement.reqNo || index} className={styles.requirementItem}>
                <div className={styles.requirementIcon}>
                  <Image
                    src="/campaign/info.png"
                    alt="info.png"
                    width={16}
                    height={16} />
                </div>
                <span className={styles.requirementText}>{requirement.content}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
} 