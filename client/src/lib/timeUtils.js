/**
 * Format a date as a relative time string (e.g., "just now", "2 mins ago", "3 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted relative time string
 */
export const formatTimeAgo = (date) => {
  const now = Date.now();
  const past = new Date(date).getTime();
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 10) {
    return "just now";
  }
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} secs ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 min ago" : `${diffInMinutes} mins ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hr ago" : `${diffInHours} hrs ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
};
