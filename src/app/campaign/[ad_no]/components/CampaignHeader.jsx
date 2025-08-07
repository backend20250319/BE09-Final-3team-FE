import Image from 'next/image';
import styles from "../styles/CampaignHeader.module.css"

export default function CampaignHeader({ title, brand, image, brand_url }) {
  return (
    <div className={styles.campaignHeader}>
      <div className={styles.headerImage}>
        <Image
          src={image}
          alt={title}
          width={1246}
          height={300}
          className={styles.heroImage}
        />
        <div className={styles.headerOverlay}>
          <div className={styles.headerContent}>
            <div className={styles.brandInfo}>
              <Image
                src={brand_url}
                alt={title}
                width={48}
                height={48}
                className={styles.brandLogo}
              />
              <div className={styles.brandDetails}>
                <h1 className={styles.campaignTitle}>{title}</h1>
                <p className={styles.brandName}>{brand}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 