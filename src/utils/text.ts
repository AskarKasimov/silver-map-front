export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  // Обрезаем до последнего пробела перед maxLength
  const truncated = text.slice(0, maxLength + 1);
  return (
    truncated.slice(0, Math.min(truncated.length, truncated.lastIndexOf(' '))) +
    '…'
  );
};
