import styles from "../../styles/FormSections/TitleSection.module.css";

export default function TitleSection({ formData, handleInputChange }) {

  return(
    <div className={styles.formSection}>
      <label className={styles.label}>
        캠페인 제목 <span className={styles.required}>*</span>
      </label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="캠페인 제목을 입력해주세요"
        className={styles.input}
      />
    </div>
  );
}