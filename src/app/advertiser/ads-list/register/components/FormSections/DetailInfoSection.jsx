import styles from "../../styles/FormSections/DetailSection.module.css";

export default function DetailInfoSection({ formData, handleInputChange }) {

  return(
    <div className={styles.formSection}>
      <label className={styles.label}>
        상품 상세 정보 <span className={styles.required}>*</span>
      </label>
      <textarea
        value={formData.content}
        onChange={(e) => handleInputChange('content', e.target.value)}
        placeholder="상품 상세 정보를 입력해주세요"
        className={styles.textarea}
        rows={10}
        style={{ resize: "vertical" }}
      />
    </div>
  );
}