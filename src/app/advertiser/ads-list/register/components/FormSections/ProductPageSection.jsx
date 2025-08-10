import styles from "../../styles/FormSections/TitleSection.module.css"

export default function ProductPageSection({ formData, handleInputChange }) {

  return (
    <div className={styles.formSection}>
      <label className={styles.label}>
        상품 판매 페이지 <span className={styles.required}>*</span>
      </label>
      <input
        type="url"
        value={formData.productPage}
        onChange={(e) => handleInputChange('productPage', e.target.value)}
        placeholder="상품 판매 페이지를 입력해주세요"
        className={styles.input}
      />
    </div>
  );
}