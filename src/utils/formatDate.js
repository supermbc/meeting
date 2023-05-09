/**
 * 格式化时间
 */

export default function formatDate(currentDate) {
  if (!currentDate) {
    return currentDate;
  }

  const date = new Date(currentDate);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
