export const formatTime = (hours) => {
  if (!hours || hours === 0) return '0ч';
  
  if (hours <= 8) {
    return `${hours}ч`;
  }
  
  const days = Math.floor(hours / 8);
  const remainingHours = hours % 8;
  
  if (remainingHours === 0) {
    return `${days}д`;
  }
  
  return `${days}д ${remainingHours}ч`;
};

export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};