import React from "react";
import styles from "./styles/Activity.module.css";

export default function ActivityManagementPage() {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.content}>
            {/* Header Section */}
            <div className={styles.header}>
              <h1 className={styles.title}>건강 관리</h1>
              <p className={styles.subtitle}>
                반려동물의 건강 활동과 의료 기록을 추적하고 관리하세요.
              </p>
            </div>

            {/* Pet Profile Section */}
            <div className={styles.petProfileSection}>
              {/* Tab Navigation */}
              <div className={styles.tabNavigation}>
                <div className={`${styles.tab} ${styles.active}`}>
                  활동 관리
                </div>
                <div className={styles.tab}>진료ㆍ처방 관리</div>
              </div>
              <h2 className={styles.sectionTitle}>반려동물 프로필</h2>
              <div className={styles.petProfiles}>
                <div className={`${styles.petCard} ${styles.active}`}>
                  <div className={styles.petInfo}>
                    <img
                      src="/images/buddy-profile.png"
                      alt="Buddy"
                      className={styles.petAvatar}
                    />
                    <div className={styles.petDetails}>
                      <h3>Buddy</h3>
                      <p>안녕하세요</p>
                    </div>
                  </div>
                </div>
                <div className={styles.petCard}>
                  <div className={styles.petInfo}>
                    <img
                      src="/images/luna-profile.png"
                      alt="Luna"
                      className={styles.petAvatar}
                    />
                    <div className={styles.petDetails}>
                      <h3>Luna</h3>
                      <p>반갑습니다</p>
                    </div>
                  </div>
                </div>
                <div className={styles.petCard}>
                  <div className={styles.petInfo}>
                    <img
                      src="/images/max-profile.png"
                      alt="Max"
                      className={styles.petAvatar}
                    />
                    <div className={styles.petDetails}>
                      <h3>Max</h3>
                      <p>환영해요</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Management Section */}
            <div className={styles.activitySection}>
              <div className={styles.navTabs}>
                <button className={`${styles.navTab} ${styles.active}`}>
                  활동 관리
                </button>
                <button className={styles.navTab}>리포트</button>
                <div className={styles.navIcon}>
                  <svg width="37" height="40" viewBox="0 0 37 40" fill="none">
                    <path
                      d="M18.5 0L36.5 10V30L18.5 40L0.5 30V10L18.5 0Z"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              <div className={styles.activityContent}>
                <div className={styles.activityGrid}>
                  {/* Left Column */}
                  <div className={styles.leftColumn}>
                    {/* Walking Activity */}
                    <div className={`${styles.activityCard} ${styles.walking}`}>
                      <div className={styles.activityHeader}>
                        <div className={styles.activityIcon}>
                          <svg
                            width="16"
                            height="18"
                            viewBox="0 0 16 18"
                            fill="none"
                          >
                            <path
                              d="M8 0L15.5 9L8 18L0.5 9L8 0Z"
                              fill="#8BC34A"
                            />
                          </svg>
                        </div>
                        <h3>산책</h3>
                      </div>
                      <div className={styles.activityForm}>
                        <div className={styles.formGroup}>
                          <label htmlFor="walking-distance">
                            산책 거리 (km)
                          </label>
                          <input
                            type="number"
                            id="walking-distance"
                            defaultValue={0.0}
                            step={0.1}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="activity-factor">
                            활동 계수 (1-10)
                          </label>
                          <input
                            type="number"
                            id="activity-factor"
                            defaultValue={5}
                            min={1}
                            max={10}
                          />
                        </div>
                        <div className={styles.calorieInfo}>
                          <div className={styles.calorieItem}>
                            <p>권장 소모 칼로리</p>
                            <p className={styles.calorieValue}>-- kcal</p>
                          </div>
                          <div className={styles.calorieItem}>
                            <p>소모 칼로리</p>
                            <p className={styles.calorieValue}>-- kcal</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feeding Activity */}
                    <div className={`${styles.activityCard} ${styles.feeding}`}>
                      <div className={styles.activityHeader}>
                        <div className={styles.activityIcon}>
                          <svg
                            width="16"
                            height="18"
                            viewBox="0 0 16 18"
                            fill="none"
                          >
                            <path
                              d="M8 0L15.5 9L8 18L0.5 9L8 0Z"
                              fill="#F5A623"
                            />
                          </svg>
                        </div>
                        <h3>식사</h3>
                      </div>
                      <div className={styles.activityForm}>
                        <div className={styles.formGroup}>
                          <label htmlFor="calorie-per-gram">
                            칼로리(kcal/g)
                          </label>
                          <input
                            type="number"
                            id="calorie-per-gram"
                            defaultValue={0}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="feeding-amount">섭취량 (g)</label>
                          <input
                            type="number"
                            id="feeding-amount"
                            defaultValue={0}
                          />
                        </div>
                        <div className={styles.calorieInfo}>
                          <div className={styles.calorieItem}>
                            <p>섭취 칼로리</p>
                            <p className={styles.calorieValue}>-- kcal</p>
                          </div>
                          <div className={styles.calorieItem}>
                            <p>권장 섭취 칼로리</p>
                            <p className={styles.calorieValue}>-- kcal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className={styles.rightColumn}>
                    {/* Weight Activity */}
                    <div className={`${styles.activityCard} ${styles.weight}`}>
                      <div className={styles.activityHeader}>
                        <div className={styles.activityIcon}>
                          <svg
                            width="23"
                            height="19"
                            viewBox="0 0 23 19"
                            fill="none"
                          >
                            <path
                              d="M11.5 0L22.5 9.5L11.5 19L0.5 9.5L11.5 0Z"
                              fill="#4CAF50"
                            />
                          </svg>
                        </div>
                        <h3>무게(KG)</h3>
                      </div>
                      <div className={styles.activityForm}>
                        <div className={styles.formGroup}>
                          <input type="number" defaultValue={0.0} step={0.1} />
                        </div>
                      </div>
                    </div>

                    {/* Sleep Activity */}
                    <div className={`${styles.activityCard} ${styles.sleep}`}>
                      <div className={styles.activityHeader}>
                        <div className={styles.activityIcon}>
                          <svg
                            width="23"
                            height="19"
                            viewBox="0 0 23 19"
                            fill="none"
                          >
                            <path
                              d="M11.5 0L22.5 9.5L11.5 19L0.5 9.5L11.5 0Z"
                              fill="#4CAF50"
                            />
                          </svg>
                        </div>
                        <h3>수면 시간</h3>
                      </div>
                      <div className={styles.activityForm}>
                        <div className={styles.formGroup}>
                          <label htmlFor="sleep-time">수면 시간 (시간)</label>
                          <input
                            type="number"
                            id="sleep-time"
                            defaultValue={0.0}
                            step={0.1}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bathroom Activity */}
                    <div
                      className={`${styles.activityCard} ${styles.bathroom}`}
                    >
                      <div className={styles.activityHeader}>
                        <div className={styles.activityIcon}>
                          <svg
                            width="16"
                            height="18"
                            viewBox="0 0 16 18"
                            fill="none"
                          >
                            <path
                              d="M8 0L15.5 9L8 18L0.5 9L8 0Z"
                              fill="#FF7675"
                            />
                          </svg>
                        </div>
                        <h3>배소변 횟수</h3>
                      </div>
                      <div className={styles.activityForm}>
                        <div className={styles.bathroomInputs}>
                          <div className={styles.formGroup}>
                            <label htmlFor="urine-count">소변 횟수</label>
                            <input
                              type="number"
                              id="urine-count"
                              defaultValue={0}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="feces-count">대변 횟수</label>
                            <input
                              type="number"
                              id="feces-count"
                              defaultValue={0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes Activity */}
                    <div className={`${styles.activityCard} ${styles.notes}`}>
                      <div className={styles.activityHeader}>
                        <div className={styles.activityIcon}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M9 0L16.88 9L9 18L1.12 9L9 0Z"
                              fill="#3B82F6"
                            />
                          </svg>
                        </div>
                        <h3>메모</h3>
                      </div>
                      <div className={styles.activityForm}>
                        <textarea
                          placeholder="Any additional observations or notes..."
                          rows={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className={styles.saveSection}>
                  <button className={styles.saveButton}>
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                      <path d="M7 0L13.5 8L7 16L0.5 8L7 0Z" fill="white" />
                    </svg>
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
