export const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'Not available';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};
