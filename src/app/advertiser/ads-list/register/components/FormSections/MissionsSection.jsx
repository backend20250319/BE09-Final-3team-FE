import styles from "../../styles/FormSections/MissionsSection.module.css";

export default function MissionsSection({ formData, setFormData }) {

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
        캠페인 미션 <span className={styles.required}>*</span>
      </label>
      {formData.missions.map((mission, index) => (
        <div key={index} className={styles.arrayFieldContainer}>
          <input
            type="text"
            value={mission}
            onChange={(e) => handleArrayFieldChange('missions', index, e.target.value)}
            placeholder="캠페인 미션을 입력해주세요"
            className={styles.input}
          />
          {formData.missions.length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayField('missions', index)}
              className={styles.removeButton}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayField('missions')}
        className={styles.addButton}
      >
        + 미션 추가
      </button>
    </div> 
  );
}