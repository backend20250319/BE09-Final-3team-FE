import Image from 'next/image';
import styles from '../../styles/FormSections/ImageUploadSection.module.css';

export default function ImageUploadSection({ formData, setFormData }) {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, mainImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.formSection}>
      <label className={styles.label}>
        캠페인 메인 이미지 <span className={styles.required}>*</span>
      </label>

      <div className={styles.imageUploadArea}>
        {formData.mainImage ? (
          <div className={styles.imagePreview}>
            <label htmlFor="imageUpload">
              <Image 
                src={formData.mainImage} 
                alt="Preview" 
                width={200} 
                height={200}
                style={{ objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
              />
            </label>
          </div>
        ) : (
          <div className={styles.uploadPlaceholder}>
            <div className={styles.uploadIcon}>
              <Image 
                src="/user/upload.svg"
                alt="Preview" 
                width={45} 
                height={45}
              />
            </div>
            <p>파일을 업로드 해주세요.</p>
            <span>PNG, JPG up to 10MB</span>
            <label htmlFor="imageUpload" className={styles.uploadButton}>
              이미지 선택
            </label>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="imageUpload"
        />
      </div>
    </div>
  );
}