import StatCard from "./StatCard";

export default function StatsCards({ data }) {
  const statData = data || {};
  const formatChange = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "";
    const sign = num > 0 ? "+" : num < 0 ? "-" : "";
    const abs = Math.abs(num).toFixed(1);
    return `${sign}${abs}%`;
  };
  const cards = [
    {
      value: statData.average_likes,
      label: "평균 좋아요",
      change: formatChange(statData.likes_mo_mpercent),
      iconType: "heart",
      borderColor: "#F5A623",
    },
    {
      value: statData.average_comments,
      label: "평균 댓글",
      change: formatChange(statData.comments_mo_mpercent),
      iconType: "comment",
      borderColor: "#8BC34A",
    },
    {
      value: statData.top_like_count,
      label: "최고 좋아요 수",
      change: formatChange(statData.top_like_mo_mpercent),
      iconType: "trophy",
      borderColor: "#FF7675",
    },
    {
      value: statData.top_comment_count,
      label: "최고 댓글 수",
      change: formatChange(statData.top_comment_mo_mpercent),
      iconType: "comments",
      borderColor: "#4A90E2",
    },
  ];

  return cards
    .filter((c) => c.value !== undefined && c.value !== null)
    .map((c) => <StatCard key={c.label} {...c} />);
}


