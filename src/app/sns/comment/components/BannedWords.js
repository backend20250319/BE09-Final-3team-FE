"use client";
import { useState } from "react";
import styles from "../styles/BannedWords.module.css";

export default function BannedWords() {
  const [bannedWords, setBannedWords] = useState([
    "spam",
    "hate",
    "abuse",
    "scam",
    "fake",
  ]);

  const addBannedWord = () => {
    // 실제 구현에서는 입력 모달이나 폼을 띄울 수 있습니다
    const newWord = prompt("새로운 금지어를 입력하세요:");
    if (
      newWord &&
      newWord.trim() &&
      !bannedWords.includes(newWord.toLowerCase())
    ) {
      setBannedWords([...bannedWords, newWord.toLowerCase()]);
    }
  };

  const removeBannedWord = (wordToRemove) => {
    setBannedWords(bannedWords.filter((word) => word !== wordToRemove));
  };

  return (
    <div className={styles.bannedWordsSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>금지어</h3>
        <button className={styles.addButton} onClick={addBannedWord}>
          <div className={styles.addIcon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 0.5C7.27614 0.5 7.5 0.723858 7.5 1V6.5H13C13.2761 6.5 13.5 6.72386 13.5 7C13.5 7.27614 13.2761 7.5 13 7.5H7.5V13C7.5 13.2761 7.27614 13.5 7 13.5C6.72386 13.5 6.5 13.2761 6.5 13V7.5H1C0.723858 7.5 0.5 7.27614 0.5 7C0.5 6.72386 0.723858 6.5 1 6.5H6.5V1C6.5 0.723858 6.72386 0.5 7 0.5Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
          금지어 추가
        </button>
      </div>

      <div className={styles.wordsContainer}>
        {bannedWords.map((word, index) => (
          <span
            key={index}
            className={styles.wordTag}
            onClick={() => removeBannedWord(word)}
            title="클릭하여 삭제"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
