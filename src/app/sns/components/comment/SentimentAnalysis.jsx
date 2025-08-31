"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/comment/SentimentAnalysis.module.css";
import { getSentimentAnalysis } from "../../lib/commentData";

export default function SentimentAnalysis({ instagram_id }) {
  const [sentimentData, setSentimentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentimentData = async () => {
      if (!instagram_id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getSentimentAnalysis(instagram_id);
        if (data) {
          // API 응답 형식에 맞게 데이터 변환
          const transformedData = [
            { 
              sentiment: "긍정", 
              percentage: Math.round(data.positive_ratio), 
              color: "#22C55E" 
            },
            { 
              sentiment: "중립", 
              percentage: Math.round(data.neutral_ratio), 
              color: "#6B7280" 
            },
            { 
              sentiment: "부정", 
              percentage: Math.round(data.negative_ratio), 
              color: "#EF4444" 
            }
          ];
          setSentimentData(transformedData);
        }
      } catch (error) {
        console.error("Failed to fetch sentiment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, [instagram_id]);

  if (loading) {
    return <div className={styles.sentimentSection}>Loading...</div>;
  }

  if (!instagram_id) {
    return (
      <div className={styles.sentimentSection}>
        <h3 className={styles.title}>감정 분석</h3>
        <div className={styles.sentimentCards}>
          <p style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>
            Instagram 프로필을 선택해주세요.
          </p>
        </div>
      </div>
    );
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "긍정":
        return (
          <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
              stroke="#16A34A"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M7 11C7 11 8.5 13 10 13C11.5 13 13 11 13 11"
              stroke="#16A34A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M8 8H8.01"
              stroke="#16A34A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8H12.01"
              stroke="#16A34A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "중립":
        return (
          <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
              stroke="#4B5563"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M8 8H8.01"
              stroke="#4B5563"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8H12.01"
              stroke="#4B5563"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 12H13"
              stroke="#4B5563"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "부정":
        return (
          <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
              stroke="#EF4444"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M8 8H8.01"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8H12.01"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 14C13 14 11.5 12 10 12C8.5 12 7 14 7 14"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.sentimentSection}>
      <h3 className={styles.title}>감정 분석</h3>
      <div className={styles.sentimentCards}>
        {sentimentData.map((item, index) => (
          <div key={index} className={styles.sentimentCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.iconContainer}
                style={{ backgroundColor: item.color + "20" }}
              >
                {getSentimentIcon(item.sentiment)}
              </div>
              <div className={styles.cardInfo}>
                <span
                  className={styles.percentage}
                  style={{ color: item.color }}
                >
                  {item.percentage}%
                </span>
                <h4 className={styles.sentimentType}>{item.sentiment}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
