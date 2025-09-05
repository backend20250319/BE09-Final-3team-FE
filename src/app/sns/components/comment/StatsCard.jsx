import { 
  AiOutlineMessage, 
  AiOutlineDelete, 
  AiOutlinePercentage, 
  AiOutlineStop 
} from "react-icons/ai";
import styles from "../../styles/comment/StatsCard.module.css";

const StatIcon = ({ label, value }) => {
  // label에 따라 아이콘과 색상 자동 결정
  const getIconAndColor = (label) => {
    switch (label) {
      case "총 댓글 수":
        return {
          icon: <AiOutlineMessage size={20} color="#3B82F6" />,
          color: "#3B82F6",
          bgColor: "#EFF6FF",
          borderColor: "#3B82F6"
        };
      case "자동 삭제된 댓글":
        return {
          icon: <AiOutlineDelete size={16} color="#EF4444" />,
          color: "#EF4444",
          bgColor: "#FEF2F2",
          borderColor: "#EF4444"
        };
      case "자동 삭제율":
        return {
          icon: <AiOutlinePercentage size={16} color="#F59E0B" />,
          color: "#F59E0B",
          bgColor: "#FFFBEB",
          borderColor: "#F59E0B"
        };
      case "금지어 댓글":
        return {
          icon: <AiOutlineStop size={16} color="#8B5CF6" />,
          color: "#8B5CF6",
          bgColor: "#F3F4F6",
          borderColor: "#8B5CF6"
        };
      default:
        return {
          icon: <AiOutlineMessage size={20} color="#6B7280" />,
          color: "#6B7280",
          bgColor: "#F9FAFB",
          borderColor: "#D1D5DB"
        };
    }
  };

  const { icon, color: iconColor, bgColor, borderColor } = getIconAndColor(label);

  return (
    <div
      className={styles.statCard}
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}CC 100%)`,
        borderColor: borderColor,
      }}
    >
      <div className={styles.statHeader}>
        <div className={styles.iconContainer}>
          {icon}
        </div>
        <div className={styles.statLabel} style={{ color: iconColor }}>
          {label}
        </div>
      </div>
      <div className={styles.statValue} style={{ color: iconColor }}>
        {value}
      </div>
    </div>
  );
};

export default function StatsCard({
  label,
  value,
}) {
  return <StatIcon label={label} value={value} />;
}
