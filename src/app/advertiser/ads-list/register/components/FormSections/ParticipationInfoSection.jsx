import DatePicker from "react-datepicker";
import styles from "../../styles/FormSections/ParticipationInfoSection.module.css";
import "react-datepicker/dist/react-datepicker.css";

export default function ParticipationInfoSection({ formData, setFormData }) {
  const handleDateChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      participationInfo: {
        ...prev.participationInfo,
        [field]: value,
      },
    }));
  };

  const handlePeriodChange = (field, type, value) => {
    setFormData((prev) => ({
      ...prev,
      participationInfo: {
        ...prev.participationInfo,
        [field]: {
          ...prev.participationInfo[field],
          [type]: value,
        },
      },
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.formSection}>
      <label className={styles.label}>
        캠페인 참여 정보 <span className={styles.required}>*</span>
      </label>

      <div className={styles.dateSection}>
        <div className={styles.dateField}>
          <label className={styles.dateLabel}>체험단 모집 기간</label>
          <div className={`${styles.dateInputs} ${styles.datePickerContainer}`}>
            <DatePicker
              selected={formData.participationInfo.recruitmentPeriod.start}
              onChange={(date) =>
                handlePeriodChange("recruitmentPeriod", "start", date)
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일"
              className={styles.datePicker}
            />
            <span>~</span>
            <DatePicker
              selected={formData.participationInfo.recruitmentPeriod.end}
              onChange={(date) =>
                handlePeriodChange("recruitmentPeriod", "end", date)
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일"
              className={styles.datePicker}
            />
          </div>
        </div>

        <div className={styles.dateField}>
          <label className={styles.dateLabel}>체험단 참여 기간</label>
          <div className={`${styles.dateInputs} ${styles.datePickerContainer}`}>
            <DatePicker
              selected={formData.participationInfo.participationPeriod.start}
              onChange={(date) =>
                handlePeriodChange("participationPeriod", "start", date)
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일"
              className={styles.datePicker}
            />
            <span>~</span>
            <DatePicker
              selected={formData.participationInfo.participationPeriod.end}
              onChange={(date) =>
                handlePeriodChange("participationPeriod", "end", date)
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일"
              className={styles.datePicker}
            />
          </div>
        </div>

        <div className={styles.dateField}>
          <label className={styles.dateLabel}>체험단 선정일</label>
          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={formData.participationInfo.selectionDate}
              onChange={(date) => handleDateChange("selectionDate", date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="체험단 선정일을 입력해주세요"
              className={styles.datePicker}
            />
          </div>
        </div>

        <div className={styles.dateField}>
          <label className={styles.dateLabel}>체험단 모집 인원</label>
          <input
            type="number"
            value={formData.participationInfo.recruitmentCount}
            onChange={(e) =>
              handleInputChange("participationInfo", {
                ...formData.participationInfo,
                recruitmentCount: e.target.value,
              })
            }
            placeholder="모집 인원을 입력해주세요"
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
}
