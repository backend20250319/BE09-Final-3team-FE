import DatePicker from "react-datepicker";
import styles from "../../styles/FormSections/ParticipationInfoSection.module.css";
import "react-datepicker/dist/react-datepicker.css";

export default function ParticipationInfoSection({ formData, setFormData }) {

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // DatePicker에서 사용할 날짜 변환 함수
  const handleDateChange = (field, date) => {
    if (date) {
      // 선택된 날짜를 로컬 시간 기준으로 설정 (시간은 00:00:00으로)
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      handleInputChange(field, localDate);
    } else {
      handleInputChange(field, null);
    }
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
              selected={formData.announceStart}
              onChange={(date) => handleDateChange("announceStart", date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일"
              className={styles.datePicker}
            />
            <span>~</span>
            <DatePicker
              selected={formData.announceEnd}
              onChange={(date) => handleDateChange("announceEnd", date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일"
              className={styles.datePicker}
              minDate={formData.announceStart}
            />
          </div>
        </div>

        <div className={styles.dateField}>
          <label className={styles.dateLabel}>체험단 참여 기간</label>
          <div className={`${styles.dateInputs} ${styles.datePickerContainer}`}>
            <DatePicker
              selected={formData.campaignStart}
              onChange={(date) => handleDateChange("campaignStart", date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일"
              className={styles.datePicker}
              minDate={formData.campaignSelect}
            />
            <span>~</span>
            <DatePicker
              selected={formData.campaignEnd}
              onChange={(date) => handleDateChange("campaignEnd", date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일"
              className={styles.datePicker}
              minDate={formData.campaignStart}
            />
          </div>
        </div>

        <div className={styles.dateField}>
          <label className={styles.dateLabel}>체험단 선정일</label>
          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={formData.campaignSelect}
              onChange={(date) => handleDateChange("campaignSelect", date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="체험단 선정일"
              className={styles.datePicker}
              minDate={formData.announceEnd}
            />
          </div>
        </div>

        <div className={styles.dateField}>
          <label className={styles.dateLabel}>체험단 모집 인원</label>
          <input
            type="number"
            value={formData.members}
            onChange={(e) => handleInputChange("members", e.target.value)}
            placeholder="모집 인원을 입력해주세요"
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
}