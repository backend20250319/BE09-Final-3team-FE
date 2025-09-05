import styles from "../../styles/FormSections/MissionsSection.module.css";

export default function RequirementsSection({ formData, setFormData }) {

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, content: value } : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { content: "" }]
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
        필수 요건 <span className={styles.required}>*</span>
      </label>
      {formData.requirement.map((requirement, index) => (
        <div key={index} className={styles.arrayFieldContainer}>
          <input
            type="text"
            value={requirement.content}
            onChange={(e) => handleArrayFieldChange('requirement', index, e.target.value)}
            placeholder="필수 요건을 입력해주세요"
            className={styles.input}
          />
          {formData.requirement.length > 1 && (
            <button
            type="button"
            onClick={() => removeArrayField('requirement', index)}
            className={styles.removeButton}
          >
            ✕
          </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayField('requirement')}
        className={styles.addButton}
      >
        + 요건 추가
      </button>
    </div>
  );
}