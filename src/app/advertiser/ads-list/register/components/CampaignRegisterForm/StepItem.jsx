import styles from '../../styles/CampaignRegisterForm/StepItem.module.css';

export default function StepItem({ step, index, isCompleted, stepColors }) {
  return (
    <div className={styles.stepItem}>
      <div 
        className={`${styles.stepCircle} ${isCompleted ? styles.completed : ''}`}
        style={{ 
          backgroundColor: isCompleted ? stepColors[index] : '#D1D5DB',
          color: isCompleted ? '#594A3E' : '#6B7280'
        }}
      >
        {isCompleted ? '✓' : step.icon}
      </div>
      <span className={styles.stepName}>{step.name}</span>
    </div>
  );
}
