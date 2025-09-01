import Image from 'next/image';
import styles from '../../styles/FormSections/ImageUploadSection.module.css';

export default function ImageUploadSection({ adImage, setAdImage, previewImage, setPreviewImage }) {
  
  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(prev => ({ ...prev, previewImage: e.target.result}));
      };
      reader.readAsDataURL(image);
    }
    setAdImage(image);
  };
  
  return (
    <div className={styles.formSection}>
      <label className={styles.label}>
        캠페인 메인 이미지 <span className={styles.required}>*</span>
      </label>

      <div className={styles.imageUploadArea}>
        {previewImage ? (
          <div className={styles.imagePreview}>
            <label htmlFor="imageUpload">
              <Image 
                src={previewImage.previewImage || previewImage.filePath}
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