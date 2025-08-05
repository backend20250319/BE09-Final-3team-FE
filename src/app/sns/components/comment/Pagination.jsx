import styles from "../../styles/comment/Pagination.module.css";

export default function Pagination({
  currentPage,
  totalComments,
  commentsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalComments / commentsPerPage);
  const startItem = (currentPage - 1) * commentsPerPage + 1;
  const endItem = Math.min(currentPage * commentsPerPage, totalComments);

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

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.info}>
        <span className={styles.infoText}>
          Showing {startItem}-{endItem} of {totalComments.toLocaleString()}{" "}
          comments
        </span>
      </div>

      <div className={styles.pagination}>
        {/* Previous Button */}
        <button
          className={`${styles.pageButton} ${
            currentPage === 1 ? styles.disabled : ""
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M8 1L1 8L8 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        {[1, 2, 3].map((page) => (
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

        {/* Next Button */}
        <button
          className={`${styles.pageButton} ${
            currentPage === totalPages ? styles.disabled : ""
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M2 1L9 8L2 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
