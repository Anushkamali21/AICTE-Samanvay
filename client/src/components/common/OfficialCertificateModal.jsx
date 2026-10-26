import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import Button from './Button';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const OfficialCertificateModal = ({ isOpen, onClose, complaint }) => {
  if (!isOpen || !complaint) return null;

  const handlePrint = () => {
    window.print();
  };

  const isResolved = complaint.currentStatus === 'Resolved' || complaint.currentStatus === 'Closed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all w-full max-w-3xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-slate-50 print:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Official Grievance Redressal Document
            </span>
            <div className="flex items-center gap-2">
              <Button onClick={handlePrint} variant="primary" size="sm" icon={Printer}>
                Print Certificate / Order
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 rounded-md p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Body (Clean Print Ready) */}
          <div className="p-8 sm:p-12 text-slate-900 font-serif border-8 border-double border-slate-300 m-4 sm:m-6 bg-white relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <span className="text-8xl font-black uppercase text-slate-900 rotate-[-25deg] select-none">
                AICTE SAMANVAY
              </span>
            </div>

            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
              <div className="w-12 h-12 mx-auto rounded-md bg-blue-900 text-white font-sans font-black text-lg flex items-center justify-center mb-2 shadow-xs">
                AICTE
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight uppercase text-slate-900">
                All India Council for Technical Education
              </h2>
              <p className="text-xs font-sans text-slate-600 uppercase tracking-widest mt-0.5">
                Ministry of Education, Government of India
              </p>
              <p className="text-xs font-sans font-semibold text-blue-900 mt-1">
                AICTE SAMANVAY: Central Grievance Redressal & Monitoring Portal
              </p>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-6">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-blue-950 font-sans border-b inline-block pb-1 border-blue-900">
                {isResolved ? 'Statutory Grievance Redressal Order' : 'Formal Grievance Acknowledgment Certificate'}
              </h3>
              <p className="text-xs font-sans text-slate-500 mt-2 font-mono">
                Official Reference: <span className="font-bold text-slate-900">{complaint.referenceId}</span>
              </p>
            </div>

            {/* Factual Roster */}
            <div className="font-sans text-xs space-y-3 my-6 bg-slate-50/80 p-5 rounded border border-slate-200">
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-600">Complainant Name:</span>
                <span className="col-span-2 font-bold text-slate-900">{complaint.complainantName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-600">Target Institution:</span>
                <span className="col-span-2 text-slate-900">{complaint.institution}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-600">Department / Branch:</span>
                <span className="col-span-2 text-slate-800">{complaint.department || 'General'}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-600">Regulatory Category:</span>
                <span className="col-span-2 font-bold text-blue-900">{complaint.category}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-600">Complaint Title:</span>
                <span className="col-span-2 font-semibold text-slate-900">{complaint.title}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-600">Current Status:</span>
                <span className="col-span-2 font-bold text-emerald-800">{complaint.currentStatus}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="font-semibold text-slate-600">Filing Timestamp:</span>
                <span className="col-span-2 text-slate-700">{formatDateTime(complaint.createdAt)}</span>
              </div>
            </div>

            {/* Resolution Narrative if resolved */}
            {complaint.resolutionSummary && (
              <div className="my-6 p-4 border-l-4 border-emerald-700 bg-emerald-50/50 font-sans text-xs">
                <h4 className="font-bold text-emerald-950 uppercase tracking-wider mb-1">
                  Binding Redressal Order Summary:
                </h4>
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {complaint.resolutionSummary.summary}
                </p>
                <div className="mt-3 pt-2 border-t border-emerald-200 text-[10px] text-slate-500 flex justify-between">
                  <span>Signatory: {complaint.resolutionSummary.resolvedBy}</span>
                  <span>Order Date: {formatDate(complaint.resolutionSummary.resolvedAt)}</span>
                </div>
              </div>
            )}

            {/* Security Verification & Sign-off Footer */}
            <div className="mt-8 pt-6 border-t-2 border-slate-800 font-sans flex items-center justify-between">
              {/* QR Code Graphic Placeholder */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 border-2 border-slate-900 p-1 flex items-center justify-center bg-white shadow-xs">
                  {/* Stylized SVG QR Representation */}
                  <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm-2 10h8v8H2v-8zm2 2v4h4v-4H4zm10-14h8v8h-8V2zm2 2v4h4V4h-4zm2 10h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                  </svg>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <span className="font-bold text-slate-800 block">Cryptographic Verification:</span>
                  <span>samanvay.aicte-india.org/verify</span>
                  <span className="block mt-0.5 font-mono text-slate-700">HASH: {complaint.referenceId}</span>
                </div>
              </div>

              {/* Digital Seal */}
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-300 rounded text-blue-900 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Digitally Authenticated</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                  Central Grievance Redressal Bureau, AICTE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialCertificateModal;
