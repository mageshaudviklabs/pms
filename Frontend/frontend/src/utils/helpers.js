export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const calculateWorkloadStatus = (workload) => {
  if (workload > 100) return 'Critical';
  if (workload > 80) return 'Warning';
  return 'Stable';
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};