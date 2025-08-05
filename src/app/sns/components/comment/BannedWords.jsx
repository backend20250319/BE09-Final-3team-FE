"use client";
import { useState, useEffect } from "react";
import {
  getBannedWords,
  addBannedWord,
  removeBannedWord,
} from "../../lib/commentData";
import styles from "../../styles/comment/BannedWords.module.css";

export default function BannedWords() {
  const [bannedWords, setBannedWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBannedWords = async () => {
      try {
        const data = await getBannedWords();
        setBannedWords(data);
      } catch (error) {
        console.error("Failed to fetch banned words:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBannedWords();
  }, []);

  const handleAddBannedWord = async () => {
    const newWord = prompt("새로운 금지어를 입력하세요:");
    if (
      newWord &&
      newWord.trim() &&
      !bannedWords.includes(newWord.toLowerCase())
    ) {
      try {
        await addBannedWord(newWord.toLowerCase());
        setBannedWords([...bannedWords, newWord.toLowerCase()]);
      } catch (error) {
        console.error("Failed to add banned word:", error);
        alert("금지어 추가에 실패했습니다.");
      }
    }
  };

  const handleRemoveBannedWord = async (wordToRemove) => {
    try {
      await removeBannedWord(wordToRemove);
      setBannedWords(bannedWords.filter((word) => word !== wordToRemove));
    } catch (error) {
      console.error("Failed to remove banned word:", error);
      alert("금지어 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className={styles.bannedWordsSection}>Loading...</div>;
  }

  return (
    <div className={styles.bannedWordsSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>금지어</h3>
        <button className={styles.addButton} onClick={handleAddBannedWord}>
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
            onClick={() => handleRemoveBannedWord(word)}
            title="클릭하여 삭제"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
