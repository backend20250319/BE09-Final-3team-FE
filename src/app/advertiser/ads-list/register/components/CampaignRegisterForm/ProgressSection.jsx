import styles from '../../styles/CampaignRegisterForm/ProgressSection.module.css'
import StepItem from './StepItem';

export default function ProgressSection({ steps, stepColors, completedSteps, progress }) {
  return (
    <div>
      <div className={styles.progressHeader}>
        <h3>등록 절차</h3>
        <span>{progress} / {steps.length} 완료</span>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${(progress / steps.length) * 100}%` }}
        />
      </div>
      
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <StepItem 
            key={index} 
            step={step} 
            index={index} 
            isCompleted={completedSteps[index]} 
            stepColors={stepColors} 
          />
        ))}
      </div>
    </div>
  );
}
