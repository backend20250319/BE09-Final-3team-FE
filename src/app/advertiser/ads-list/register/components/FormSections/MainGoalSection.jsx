import styles from "../../styles/FormSections/DetailSection.module.css"

export default function MainGoalSection({ formData, handleInputChange }) {

  return(
    <div className={styles.formSection}>
      <label className={styles.label}>
        주요 목표 <span className={styles.required}>*</span>
      </label>
      <textarea
        value={formData.objective}
        onChange={(e) => handleInputChange('objective', e.target.value)}
        placeholder="캠페인의 주요 목표를 입력해주세요"
        className={styles.textarea}
        rows={4}
      />
    </div>
  );
}