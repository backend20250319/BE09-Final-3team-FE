import styles from "../../styles/FormSections/MissionsSection.module.css";

export default function KeywordsSection({ formData, setFormData }) {

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return(
    <div className={styles.formSection}>
      <label className={styles.label}>
        키워드 <span className={styles.required}>*</span>
      </label>
      {formData.keywords.map((keyword, index) => (
        <div key={index} className={styles.arrayFieldContainer}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleArrayFieldChange('keywords', index, e.target.value)}
            placeholder="키워드를 입력해주세요"
            className={styles.input}
          />
          {formData.keywords.length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayField('keywords', index)}
              className={styles.removeButton}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayField('keywords')}
        className={styles.addButton}
      >
        + 키워드 추가
      </button>
    </div>
  );
}