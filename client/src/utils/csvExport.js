export const exportComplaintsToCSV = (complaints = [], filename = 'aicte_grievances_roster.csv') => {
  if (!complaints.length) return;

  const headers = [
    'Reference ID',
    'Title',
    'Category',
    'Target Institution',
    'Department',
    'Priority',
    'Current Status',
    'Assigned Cell',
    'Assigned Officer',
    'Filing Date',
    'Last Updated'
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = complaints.map(c => [
    escapeCSV(c.referenceId),
    escapeCSV(c.title),
    escapeCSV(c.category),
    escapeCSV(c.institution),
    escapeCSV(c.department || 'General'),
    escapeCSV(c.priority),
    escapeCSV(c.currentStatus),
    escapeCSV(c.assignedCell),
    escapeCSV(c.assignedTo),
    escapeCSV(new Date(c.createdAt).toLocaleDateString('en-IN')),
    escapeCSV(new Date(c.updatedAt).toLocaleDateString('en-IN'))
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default exportComplaintsToCSV;
