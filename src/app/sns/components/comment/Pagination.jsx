import styles from "../../styles/comment/Pagination.module.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  // Spring Pagination과 호환되는 페이지 번호 생성 (1부터 시작)
  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // 끝 페이지가 부족하면 시작 페이지를 앞으로 이동
    if (end - start + 1 < maxVisible && start > 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pagination}>
        {/* 이전 버튼 */}
        <button
          className={`${styles.pageButton} ${styles.navButton} ${
            currentPage === 1 ? styles.disabled : ""
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {/* 페이지 번호들 (Spring Pagination 방식: 1부터 시작) */}
        {visiblePages.map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${
              currentPage === page ? styles.active : ""
            }`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        ))}

        {/* 다음 버튼 */}
        <button
          className={`${styles.pageButton} ${styles.navButton} ${
            currentPage >= totalPages ? styles.disabled : ""
          }`}
          onClick={handleNext}
          disabled={currentPage >= totalPages}
        >
          &gt;
        </button>
      </div>

      <div className={styles.info}>
        <span className={styles.infoText}>
          페이지 {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
}
