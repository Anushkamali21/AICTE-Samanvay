import React from 'react';
import EmptyState from './EmptyState';

export const Table = ({
  columns = [],
  data = [],
  keyField = '_id',
  isLoading = false,
  emptyMessage = 'No records found matching the criteria.',
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-lg p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700 border-t-transparent mb-3" />
        <p className="text-sm text-slate-500">Loading records...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8">
        <EmptyState title="No Records Available" description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-xs ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className={`py-3 px-4 font-semibold text-xs text-slate-700 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row, rowIndex) => (
            <tr key={row[keyField] || rowIndex} className="hover:bg-slate-50/80 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className={`py-3 px-4 text-slate-700 ${col.cellClassName || ''}`}>
                  {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
