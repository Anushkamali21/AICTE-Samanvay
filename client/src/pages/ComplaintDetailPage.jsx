import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  MessageSquare,
  ShieldAlert,
  RotateCcw,
  Star,
  Download,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Award,
  Eye,
  Link2
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input, { Textarea } from '../components/common/Input';
import Select from '../components/common/Select';
import StatusTimeline from '../components/common/StatusTimeline';
import DocumentPreviewModal from '../components/common/DocumentPreviewModal';
import OfficialCertificateModal from '../components/common/OfficialCertificateModal';
import { useAuth } from '../context/AuthContext';
import {
  getComplaintById,
  addNote,
  uploadDocument,
  requestReopen,
  updateComplaintStatus,
  assignComplaint,
  linkComplaints,
  escalateComplaint,
  submitInstitutionResponse,
  resolveComplaint
} from '../services/complaintService';
import { formatDate, formatDateTime, formatFileSize } from '../utils/formatters';
import {
  COMPLAINT_STATUSES,
  ROLES,
  ROLE_LABELS
} from '../utils/constants';

const ALLOWED_STATUS_OPTIONS = {
  [COMPLAINT_STATUSES.SUBMITTED]: [COMPLAINT_STATUSES.ACKNOWLEDGED, COMPLAINT_STATUSES.UNDER_REVIEW],
  [COMPLAINT_STATUSES.ACKNOWLEDGED]: [COMPLAINT_STATUSES.UNDER_REVIEW, COMPLAINT_STATUSES.ASSIGNED],
  [COMPLAINT_STATUSES.UNDER_REVIEW]: [COMPLAINT_STATUSES.ASSIGNED, COMPLAINT_STATUSES.AWAITING_INSTITUTION_RESPONSE, COMPLAINT_STATUSES.IN_PROGRESS, COMPLAINT_STATUSES.ESCALATED, COMPLAINT_STATUSES.RESOLVED],
  [COMPLAINT_STATUSES.ASSIGNED]: [COMPLAINT_STATUSES.AWAITING_INSTITUTION_RESPONSE, COMPLAINT_STATUSES.IN_PROGRESS, COMPLAINT_STATUSES.ESCALATED, COMPLAINT_STATUSES.RESOLVED],
  [COMPLAINT_STATUSES.AWAITING_INSTITUTION_RESPONSE]: [COMPLAINT_STATUSES.IN_PROGRESS, COMPLAINT_STATUSES.ESCALATED, COMPLAINT_STATUSES.RESOLVED],
  [COMPLAINT_STATUSES.IN_PROGRESS]: [COMPLAINT_STATUSES.AWAITING_INSTITUTION_RESPONSE, COMPLAINT_STATUSES.ESCALATED, COMPLAINT_STATUSES.RESOLVED],
  [COMPLAINT_STATUSES.ESCALATED]: [COMPLAINT_STATUSES.IN_PROGRESS, COMPLAINT_STATUSES.RESOLVED],
  [COMPLAINT_STATUSES.RESOLVED]: [COMPLAINT_STATUSES.CLOSED, COMPLAINT_STATUSES.REOPENED],
  [COMPLAINT_STATUSES.CLOSED]: [COMPLAINT_STATUSES.REOPENED],
  [COMPLAINT_STATUSES.REOPENED]: [COMPLAINT_STATUSES.UNDER_REVIEW, COMPLAINT_STATUSES.ASSIGNED, COMPLAINT_STATUSES.ESCALATED]
};

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Complainant Action Modals
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  // Officer Action Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusExplanation, setStatusExplanation] = useState('');

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedCell, setAssignedCell] = useState('');
  const [assignRemark, setAssignRemark] = useState('');

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [targetLinkRef, setTargetLinkRef] = useState('');
  const [linkReason, setLinkReason] = useState('');

  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');

  const [showResponseModal, setShowResponseModal] = useState(false);
  const [institutionResponseText, setInstitutionResponseText] = useState('');

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionSummaryText, setResolutionSummaryText] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getComplaintById(id);
      if (res.success) {
        setComplaint(res.complaint);
        setHistory(res.history || []);
        setFeedback(res.feedback || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const isComplainant = user && complaint && (
    complaint.complainantId === user._id ||
    complaint.complainantEmail?.toLowerCase() === user.email?.toLowerCase()
  );

  const isOfficer = user && [ROLES.INSTITUTION_NODAL, ROLES.AICTE_ADMIN].includes(user.role);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      setActionLoading(true);
      await addNote(complaint._id, noteText.trim());
      setShowNoteModal(false);
      setNoteText('');
      setSuccessMsg('Additional information appended to case history.');
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to append information.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    try {
      setActionLoading(true);
      const fd = new FormData();
      fd.append('document', uploadFile);
      await uploadDocument(complaint._id, fd);
      setShowUploadModal(false);
      setUploadFile(null);
      setSuccessMsg('Supporting document uploaded and verified.');
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    try {
      setActionLoading(true);
      await requestReopen(complaint._id, reopenReason.trim());
      setShowReopenModal(false);
      setReopenReason('');
      setSuccessMsg('Reopen request submitted for administrative review.');
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit reopening request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!newStatus || !statusExplanation.trim()) return;
    try {
      setActionLoading(true);
      await updateComplaintStatus(complaint._id, newStatus, statusExplanation.trim());
      setShowStatusModal(false);
      setNewStatus('');
      setStatusExplanation('');
      setSuccessMsg(`Status updated to "${newStatus}".`);
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Status transition rejected.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignedTo.trim() || !assignedCell.trim()) return;
    try {
      setActionLoading(true);
      await assignComplaint(complaint._id, {
        assignedTo: assignedTo.trim(),
        assignedCell: assignedCell.trim(),
        remark: assignRemark.trim() || undefined
      });
      setShowAssignModal(false);
      setSuccessMsg('Complaint assigned to officer and cell.');
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update assignment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLinkCase = async (e) => {
    e.preventDefault();
    if (!targetLinkRef.trim()) return;
    try {
      setActionLoading(true);
      await linkComplaints(complaint._id, targetLinkRef.trim(), linkReason.trim());
      setShowLinkModal(false);
      setTargetLinkRef('');
      setLinkReason('');
      setSuccessMsg('Complaints bundled for joint inquiry.');
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to link cases.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async (e) => {
    e.preventDefault();
    if (!escalateReason.trim()) return;
    try {
      setActionLoading(true);
      await escalateComplaint(complaint._id, escalateReason.trim());
      setShowEscalateModal(false);
      setEscalateReason('');
      setSuccessMsg('Complaint escalated to higher authority.');
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to escalate complaint.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInstitutionResponse = async (e) => {
    e.preventDefault();
    if (!institutionResponseText.trim()) return;
    try {
      setActionLoading(true);
      await submitInstitutionResponse(complaint._id, institutionResponseText.trim());
      setShowResponseModal(false);
      setInstitutionResponseText('');
      setSuccessMsg('Institutional response formally recorded.');
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record response.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!resolutionSummaryText.trim()) return;
    try {
      setActionLoading(true);
      await resolveComplaint(complaint._id, resolutionSummaryText.trim());
      setShowResolveModal(false);
      setResolutionSummaryText('');
      setSuccessMsg('Formal resolution issued. Complainant notified.');
      await fetchComplaintDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue resolution.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-lg">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700 border-t-transparent mb-3" />
        <p className="text-xs text-slate-500">Loading complaint case record...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-lg">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-900">Case Record Unavailable</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This complaint does not exist or you do not have authorization to view its records.
        </p>
        <Button onClick={() => navigate('/complaints')} variant="secondary" size="sm">
          Return to Grievance List
        </Button>
      </div>
    );
  }

  const allowedTransitions = ALLOWED_STATUS_OPTIONS[complaint.currentStatus] || [];
  const isResolvedOrClosed = complaint.currentStatus === COMPLAINT_STATUSES.RESOLVED || complaint.currentStatus === COMPLAINT_STATUSES.CLOSED;

  return (
    <div className="space-y-6">
      {/* Back button and quick actions header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grievance Records</span>
        </button>

        {/* Top Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Certificate / Order Generator Button */}
          <Button
            onClick={() => setShowCertificateModal(true)}
            variant="secondary"
            size="sm"
            icon={Award}
          >
            {isResolvedOrClosed ? 'Official Resolution Order' : 'Official Acknowledgment Certificate'}
          </Button>

          {isComplainant && isResolvedOrClosed && !feedback && (
            <Button
              onClick={() => navigate('/feedback')}
              variant="success"
              size="sm"
              icon={Star}
            >
              Submit Feedback
            </Button>
          )}

          {isComplainant && isResolvedOrClosed && (
            <Button
              onClick={() => setShowReopenModal(true)}
              variant="secondary"
              size="sm"
              icon={RotateCcw}
            >
              Request Reopening
            </Button>
          )}

          {isComplainant && !isResolvedOrClosed && (
            <>
              <Button
                onClick={() => setShowNoteModal(true)}
                variant="secondary"
                size="sm"
                icon={MessageSquare}
              >
                Add Information
              </Button>
              <Button
                onClick={() => setShowUploadModal(true)}
                variant="secondary"
                size="sm"
                icon={Upload}
              >
                Upload Document
              </Button>
            </>
          )}

          {/* Officer Workbench Actions */}
          {isOfficer && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setNewStatus(allowedTransitions[0] || '');
                  setShowStatusModal(true);
                }}
                disabled={allowedTransitions.length === 0}
                variant="primary"
                size="sm"
              >
                Update Status
              </Button>
              <Button
                onClick={() => setShowAssignModal(true)}
                variant="secondary"
                size="sm"
              >
                Assign
              </Button>
              <Button
                onClick={() => setShowLinkModal(true)}
                variant="secondary"
                size="sm"
                icon={Link2}
              >
                Link Case
              </Button>
              {user.role === ROLES.INSTITUTION_NODAL && (
                <Button
                  onClick={() => setShowResponseModal(true)}
                  variant="secondary"
                  size="sm"
                >
                  File Response
                </Button>
              )}
              <Button
                onClick={() => setShowEscalateModal(true)}
                variant="secondary"
                size="sm"
              >
                Escalate
              </Button>
              <Button
                onClick={() => setShowResolveModal(true)}
                variant="success"
                size="sm"
                icon={CheckCircle2}
              >
                Issue Resolution
              </Button>
            </div>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center justify-between">
          <span>{successMsg}</span>
          <button type="button" onClick={() => setSuccessMsg('')} className="font-bold ml-2">×</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Sensitive Complaint Notice */}
      {complaint.isSensitive && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Confidential Case Protection Active</p>
            <p className="mt-0.5 text-amber-800">
              This grievance involves sensitive welfare or misconduct allegations. Complainant identity details are restricted in compliance with institutional confidentiality protocols.
            </p>
          </div>
        </div>
      )}

      {/* Case Header Card with SLA Countdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Reference ID:
              </span>
              <span className="text-base font-extrabold text-blue-800 font-mono">
                {complaint.referenceId}
              </span>
              <Badge status={complaint.currentStatus}>{complaint.currentStatus}</Badge>
              <span className={`text-xs px-2 py-0.5 rounded-sm font-semibold border ${
                complaint.priority === 'Urgent'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : complaint.priority === 'High'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {complaint.priority} Priority
              </span>

              {/* SLA Indicator */}
              {complaint.slaStatus && (
                <span className={`text-xs px-2.5 py-0.5 rounded-sm font-semibold border ${complaint.slaStatus.badgeClass}`}>
                  {complaint.slaStatus.label}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-2">
              {complaint.title}
            </h2>
          </div>

          <div className="text-left md:text-right text-xs text-slate-500 shrink-0">
            <p><span className="font-medium text-slate-700">Filing Date:</span> {formatDate(complaint.createdAt)}</p>
            <p className="mt-1"><span className="font-medium text-slate-700">Assigned Cell:</span> {complaint.assignedCell}</p>
          </div>
        </div>

        {/* Narrative & Details */}
        <div className="space-y-4 text-xs">
          <div>
            <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Grievance Narrative:
            </span>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
              {complaint.description}
            </div>
          </div>

          {complaint.expectedResolution && (
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Remedy / Resolution Sought:
              </span>
              <p className="p-3 bg-slate-50/70 border border-slate-200 rounded-md text-slate-700">
                {complaint.expectedResolution}
              </p>
            </div>
          )}

          {/* Institutional metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3 border border-slate-200 rounded-md">
              <span className="text-slate-500 font-medium block">Target Institution:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{complaint.institution}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-md">
              <span className="text-slate-500 font-medium block">Target Department:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{complaint.department || 'General'}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-md">
              <span className="text-slate-500 font-medium block">Complainant Affiliation:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {complaint.complainantName} ({ROLE_LABELS[complaint.complainantRole] || complaint.complainantRole})
              </span>
            </div>
          </div>

          {/* Bundled / Linked Cases Banner */}
          {complaint.linkedCases && complaint.linkedCases.length > 0 && (
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-md text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Link2 className="w-4 h-4 text-blue-700" />
                <span>Bundled Related Cases:</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {complaint.linkedCases.map((refId) => (
                  <span key={refId} className="px-2 py-0.5 bg-white border border-blue-300 font-mono text-blue-800 rounded font-semibold">
                    {refId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolution Summary Banner if Resolved */}
      {complaint.resolutionSummary && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-5">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>Formal Redressal Resolution</span>
          </div>
          <p className="text-xs text-emerald-800 mt-2 whitespace-pre-wrap">
            {complaint.resolutionSummary.summary}
          </p>
          <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-700 flex justify-between">
            <span>Resolved By: {complaint.resolutionSummary.resolvedBy}</span>
            <span>Timestamp: {formatDateTime(complaint.resolutionSummary.resolvedAt)}</span>
          </div>
        </div>
      )}

      {/* Institutional Response Banner if Provided */}
      {complaint.institutionResponse && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-xs">
          <div className="flex items-center gap-2 text-blue-900 font-bold mb-1">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Official Institutional Response</span>
          </div>
          <p className="text-slate-800 mt-1 whitespace-pre-wrap">
            {complaint.institutionResponse.response}
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            Submitted by {complaint.institutionResponse.respondedBy} on {formatDateTime(complaint.institutionResponse.respondedAt)}
          </p>
        </div>
      )}

      {/* Visual Status Timeline and Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Visual Status Timeline & Action Log"
            subtitle="Verified chronological stages recorded by authorized officers and intake systems"
          >
            <StatusTimeline history={history} currentStatus={complaint.currentStatus} />
          </Card>

          {/* Additional Notes Appended */}
          <Card
            title="Communication & Clarification History"
            subtitle="Follow-up notes and clarifications appended by complainant or investigating bureau"
            action={
              isComplainant && !isResolvedOrClosed && (
                <Button onClick={() => setShowNoteModal(true)} variant="secondary" size="sm">
                  Append Note
                </Button>
              )
            }
          >
            {(!complaint.additionalNotes || complaint.additionalNotes.length === 0) ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No supplemental clarifications have been appended yet.
              </p>
            ) : (
              <div className="space-y-3">
                {complaint.additionalNotes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
                    <div className="flex justify-between font-semibold text-slate-800 mb-1">
                      <span>{note.authorName} ({ROLE_LABELS[note.authorRole] || note.authorRole})</span>
                      <span className="text-slate-400 font-normal">{formatDateTime(note.createdAt)}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{note.note}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar: Supporting Documents & Feedback Details */}
        <div className="space-y-6">
          {/* Supporting Documents Card with In-Browser Preview */}
          <Card
            title="Supporting Documents"
            subtitle="Evidentiary files uploaded with this complaint"
            action={
              isComplainant && !isResolvedOrClosed && (
                <Button onClick={() => setShowUploadModal(true)} variant="secondary" size="sm">
                  Upload
                </Button>
              )
            }
          >
            {(!complaint.supportingDocuments || complaint.supportingDocuments.length === 0) ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No supporting documents attached.
              </p>
            ) : (
              <div className="space-y-2">
                {complaint.supportingDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs"
                  >
                    <div className="truncate max-w-[150px]">
                      <p className="font-semibold text-slate-800 truncate">{doc.originalName}</p>
                      <p className="text-[10px] text-slate-500">{formatFileSize(doc.size)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700"
                        title="Preview Document in Browser"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-slate-200 text-blue-700"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Feedback Status Card */}
          <Card
            title="Complainant Satisfaction"
            subtitle="Post-resolution audit assessment"
          >
            {feedback ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Overall Rating:</span>
                  <div className="flex items-center text-amber-500 font-bold">
                    <span>{feedback.rating} / 5 Stars</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Adequately Resolved:</span>
                  <Badge variant={feedback.resolvedAdequately === 'Yes' ? 'success' : 'warning'}>
                    {feedback.resolvedAdequately}
                  </Badge>
                </div>
                {feedback.comments && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium block">Complainant Remarks:</span>
                    <p className="mt-1 text-slate-800 italic">"{feedback.comments}"</p>
                  </div>
                )}
              </div>
            ) : isResolvedOrClosed ? (
              <div className="text-center py-4 text-xs">
                <p className="text-slate-500 mb-3">Feedback has not been submitted for this resolved case.</p>
                {isComplainant && (
                  <Button onClick={() => navigate('/feedback')} variant="primary" size="sm">
                    Submit Satisfaction Feedback
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                Feedback collection activates after formal resolution is issued.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* MODAL: DOCUMENT PREVIEW */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
      />

      {/* MODAL: OFFICIAL CERTIFICATE & RESOLUTION ORDER */}
      <OfficialCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        complaint={complaint}
      />

      {/* MODAL: ADD INFORMATION */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Append Clarification Note"
        subtitle="Add factual information or address queries raised by the investigating officer"
        footer={
          <>
            <Button onClick={() => setShowNoteModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleAddNote} variant="primary" size="sm" loading={actionLoading}>
              Submit Clarification
            </Button>
          </>
        }
      >
        <Textarea
          label="Information or Clarification Text"
          placeholder="State your additional points clearly..."
          rows={4}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          required
        />
      </Modal>

      {/* MODAL: UPLOAD DOCUMENT */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Supporting Document"
        subtitle="Attach evidentiary letters, receipts, or affidavits"
        footer={
          <>
            <Button onClick={() => setShowUploadModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleUploadDoc} variant="primary" size="sm" loading={actionLoading} disabled={!uploadFile}>
              Upload Document
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <input
            type="file"
            id="modalUpload"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setUploadFile(e.target.files[0]);
              }
            }}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-[11px] text-slate-500">
            Accepted formats: PDF, JPG, PNG. Maximum size: 5 MB.
          </p>
        </div>
      </Modal>

      {/* MODAL: REOPEN REQUEST */}
      <Modal
        isOpen={showReopenModal}
        onClose={() => setShowReopenModal(false)}
        title="Request Case Reopening"
        subtitle="Submit a formal justification if the resolution issued was incomplete or unfulfilled"
        footer={
          <>
            <Button onClick={() => setShowReopenModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleRequestReopen} variant="danger" size="sm" loading={actionLoading}>
              Submit Reopen Request
            </Button>
          </>
        }
      >
        <Textarea
          label="Justification for Reopening"
          placeholder="State why the issued resolution failed to address the original grievance..."
          rows={4}
          value={reopenReason}
          onChange={(e) => setReopenReason(e.target.value)}
          required
        />
      </Modal>

      {/* MODAL: OFFICER STATUS UPDATE */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Workflow Status"
        subtitle={`Current Status: ${complaint.currentStatus}`}
        footer={
          <>
            <Button onClick={() => setShowStatusModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} variant="primary" size="sm" loading={actionLoading}>
              Commit Status Update
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Target Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={allowedTransitions.map(s => ({ value: s, label: s }))}
            required
            helperText="Only verified workflow transitions are permitted."
          />
          <Textarea
            label="Audited Explanatory Remark"
            placeholder="Document the legal or procedural justification for this status change..."
            rows={3}
            value={statusExplanation}
            onChange={(e) => setStatusExplanation(e.target.value)}
            required
            helperText="This explanation will be logged in the permanent audit history."
          />
        </div>
      </Modal>

      {/* MODAL: OFFICER ASSIGNMENT */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Grievance to Officer or Cell"
        subtitle="Designate the responsible investigating officer and jurisdiction cell"
        footer={
          <>
            <Button onClick={() => setShowAssignModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleAssign} variant="primary" size="sm" loading={actionLoading}>
              Save Assignment
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Assigned Officer Name"
            placeholder="e.g. Prof. Ramesh Chandra"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          />
          <Input
            label="Assigned Bureau / Cell"
            placeholder="e.g. Academic Redressal Cell"
            value={assignedCell}
            onChange={(e) => setAssignedCell(e.target.value)}
            required
          />
          <Textarea
            label="Assignment Directive / Remark"
            placeholder="Optional instructions for the assigned officer..."
            rows={2}
            value={assignRemark}
            onChange={(e) => setAssignRemark(e.target.value)}
          />
        </div>
      </Modal>

      {/* MODAL: LINK RELATED CASES */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="Bundle / Link Related Grievance"
        subtitle="Consolidate duplicate or overlapping complaints under joint inquiry"
        footer={
          <>
            <Button onClick={() => setShowLinkModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleLinkCase} variant="primary" size="sm" loading={actionLoading}>
              Confirm Case Link
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Target Reference Identifier"
            placeholder="e.g. AICTE-2026-000102"
            value={targetLinkRef}
            onChange={(e) => setTargetLinkRef(e.target.value.toUpperCase())}
            required
            helperText="The other complaint reference to bundle with this case."
          />
          <Textarea
            label="Ground for Bundling / Linking"
            placeholder="Document why these complaints represent overlapping institutional issues..."
            rows={3}
            value={linkReason}
            onChange={(e) => setLinkReason(e.target.value)}
          />
        </div>
      </Modal>

      {/* MODAL: ESCALATION */}
      <Modal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        title="Escalate Grievance Case"
        subtitle="Escalate to Central AICTE Grievance Bureau for high-level regulatory intervention"
        footer={
          <>
            <Button onClick={() => setShowEscalateModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleEscalate} variant="danger" size="sm" loading={actionLoading}>
              Confirm Escalation
            </Button>
          </>
        }
      >
        <Textarea
          label="Escalation Ground / Reason"
          placeholder="State why the standard resolution threshold was breached or why higher intervention is mandatory..."
          rows={4}
          value={escalateReason}
          onChange={(e) => setEscalateReason(e.target.value)}
          required
        />
      </Modal>

      {/* MODAL: INSTITUTION RESPONSE */}
      <Modal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        title="Submit Formal Institutional Response"
        subtitle="Record findings of the institutional inquiry committee"
        footer={
          <>
            <Button onClick={() => setShowResponseModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleInstitutionResponse} variant="primary" size="sm" loading={actionLoading}>
              Submit Institutional Reply
            </Button>
          </>
        }
      >
        <Textarea
          label="Inquiry Report and Institutional Findings"
          placeholder="Document the institutional inquiry conclusions, actions initiated, and supporting evidence..."
          rows={5}
          value={institutionResponseText}
          onChange={(e) => setInstitutionResponseText(e.target.value)}
          required
        />
      </Modal>

      {/* MODAL: RESOLUTION ISSUANCE */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        title="Issue Formal Grievance Resolution"
        subtitle="Record the binding resolution terms and mark this complaint as Resolved"
        footer={
          <>
            <Button onClick={() => setShowResolveModal(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleResolve} variant="success" size="sm" loading={actionLoading}>
              Issue Final Resolution
            </Button>
          </>
        }
      >
        <Textarea
          label="Formal Redressal Order Summary"
          placeholder="State the final decision, directives issued to the institution, and compliance deadline..."
          rows={5}
          value={resolutionSummaryText}
          onChange={(e) => setResolutionSummaryText(e.target.value)}
          required
          helperText="Upon issuing, the complainant will be prompted for satisfaction audit feedback."
        />
      </Modal>
    </div>
  );
};

export default ComplaintDetailPage;
