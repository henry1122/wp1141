import { formatDistanceToNow, format } from "date-fns";
import { zhTW } from "date-fns/locale";

/**
 * 格式化時間為相對時間（幾秒前、幾分鐘前等）
 */
export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // 如果超過 7 天，顯示絕對日期
  if (diffInSeconds > 7 * 24 * 60 * 60) {
    const diffInYears = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24 * 365));
    if (diffInYears >= 1) {
      return format(dateObj, "yyyy年MM月dd日", { locale: zhTW });
    }
    return format(dateObj, "MM月dd日", { locale: zhTW });
  }

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: zhTW,
  });
}

/**
 * 格式化數字（超過 1000 顯示 K）
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

