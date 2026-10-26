import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import Button from './Button';
import { formatFileSize } from '../../utils/formatters';

export const DocumentPreviewModal = ({ isOpen, onClose, document: doc }) => {
  if (!isOpen || !doc) return null;

  const isPdf = doc.mimeType === 'application/pdf' || doc.fileName?.endsWith('.pdf');
  const isImage = doc.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(doc.fileName || '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all w-full max-w-4xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-100 text-blue-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">
                  {doc.originalName || doc.fileName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Size: {formatFileSize(doc.size)} | Verified Format: {doc.mimeType || 'Document'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                download={doc.originalName || doc.fileName}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 rounded-md p-1.5"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Content Area */}
          <div className="flex-1 overflow-auto p-4 bg-slate-100 min-h-[450px] flex items-center justify-center">
            {isPdf ? (
              <iframe
                src={`${doc.url}#toolbar=0`}
                title={doc.originalName || 'PDF Document Preview'}
                className="w-full h-[550px] rounded border border-slate-300 bg-white shadow-xs"
              />
            ) : isImage ? (
              <img
                src={doc.url}
                alt={doc.originalName || 'Evidence preview'}
                className="max-h-[550px] max-w-full rounded border border-slate-300 shadow-xs object-contain bg-white p-2"
              />
            ) : (
              <div className="text-center p-8 bg-white rounded-lg border border-slate-200">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">Preview Not Supported for this File Type</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">Please download the file directly to view its contents.</p>
                <a
                  href={doc.url}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-xs font-semibold rounded-md hover:bg-blue-800"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
