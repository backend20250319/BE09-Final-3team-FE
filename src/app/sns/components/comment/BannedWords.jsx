"use client";
import { useState, useEffect } from "react";
import {
  getBannedWords,
  addBannedWord,
  removeBannedWord,
} from "../../lib/commentData";
import styles from "../../styles/comment/BannedWords.module.css";
import { IoSearchOutline } from "react-icons/io5";

export default function BannedWords({ instagram_id }) {
  const [bannedWords, setBannedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [wordToRemove, setWordToRemove] = useState("");

  useEffect(() => {
    const fetchBannedWords = async () => {
      if (!instagram_id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getBannedWords(instagram_id);
        // API 응답에서 word 필드만 추출
        const words = data.map(item => item.word);
        setBannedWords(words);
      } catch (error) {
        console.error("Failed to fetch banned words:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBannedWords();
  }, [instagram_id]);

  const handleAddBannedWord = async () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (
      newWord &&
      newWord.trim() &&
      !bannedWords.includes(newWord.toLowerCase())
    ) {
      try {
        const result = await addBannedWord(instagram_id, newWord.toLowerCase());
        if (result.success) {
          setBannedWords([...bannedWords, newWord.toLowerCase()]);
          setNewWord("");
          setIsModalOpen(false);
        } else {
          alert(result.message || "금지어 추가에 실패했습니다.");
        }
      } catch (error) {
        console.error("Failed to add banned word:", error);
        alert("금지어 추가에 실패했습니다.");
      }
    }
  };

  const handleModalCancel = () => {
    setNewWord("");
    setIsModalOpen(false);
  };

  // 검색어로 필터링된 금지어 목록
  const filteredBannedWords = bannedWords.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveBannedWord = (word) => {
    setWordToRemove(word);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
              const result = await removeBannedWord(instagram_id, wordToRemove);
      if (result.success) {
        setBannedWords(bannedWords.filter((word) => word !== wordToRemove));
        setIsConfirmModalOpen(false);
        setWordToRemove("");
      } else {
        alert(result.message || "금지어 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to remove banned word:", error);
      alert("금지어 삭제에 실패했습니다.");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setWordToRemove("");
  };

  if (loading) {
    return <div className={styles.bannedWordsSection}>Loading...</div>;
  }

  if (!instagram_id) {
    return (
      <div className={styles.bannedWordsSection}>
        <div className={styles.header}>
          <h3 className={styles.title}>금지어</h3>
        </div>
        <div className={styles.wordsContainer}>
          <p style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>
            Instagram 프로필을 선택해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bannedWordsSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>금지어</h3>
        <div className={styles.headerActions}>
          {/* 검색창 */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="금지어 검색..."
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>
              <IoSearchOutline size={16} />
            </div>
          </div>
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
      </div>

      <div className={styles.wordsContainer}>
        {filteredBannedWords.map((word, index) => (
          <div key={index} className={styles.wordTag}>
            <span className={styles.wordText}>{word}</span>
            <button
              className={styles.deleteButton}
              onClick={() => handleRemoveBannedWord(word)}
              title="금지어 삭제"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalCancel}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>새로운 금지어 추가</h3>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="금지어를 입력하세요"
              className={styles.modalInput}
              onKeyPress={(e) => e.key === "Enter" && handleModalSubmit()}
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={handleModalCancel}
              >
                취소
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleModalSubmit}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isConfirmModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCancelDelete}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>금지어 삭제</h3>
            <p className={styles.confirmMessage}>
              <strong>"{wordToRemove}"</strong> 금지어를 삭제하시겠습니까?
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelDelete}
              >
                취소
              </button>
              <button
                className={styles.confirmDeleteButton}
                onClick={handleConfirmDelete}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
