import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  Lock,
  ArrowRight,
  Search,
  AlertCircle,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { getPublicStatus } from '../services/complaintService';
import { ROLES, ROLE_LABELS } from '../utils/constants';
import { formatDate, formatDateTime } from '../utils/formatters';

export const LandingPage = () => {
  const { user, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  // Public reference search state
  const [publicRefId, setPublicRefId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  const handleDemoSignIn = async (role) => {
    await quickDemoLogin(role);
    navigate('/dashboard');
  };

  const handlePublicTrack = async (e) => {
    e.preventDefault();
    if (!publicRefId.trim()) return;

    try {
      setSearchLoading(true);
      setSearchError('');
      setSearchResult(null);
      const res = await getPublicStatus(publicRefId.trim());
      if (res.success && res.status) {
        setSearchResult(res.status);
      }
    } catch (err) {
      setSearchError(err.response?.data?.message || 'No grievance record found with this reference identifier.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top institutional strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">All India Council for Technical Education</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">Ministry of Education, Government of India</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/help" className="hover:text-white transition-colors">Helpdesk</Link>
            <a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              AICTE Official
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-700 flex items-center justify-center text-white font-bold text-base shadow-xs">
              AS
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                AICTE SAMANVAY
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Integrated Complaint Management and Tracking Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} variant="primary" size="md">
                Open Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} variant="primary" size="md">
                Sign In to Portal
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-white border-b border-slate-200 py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            Official Grievance Monitoring Platform
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            AICTE SAMANVAY
          </h2>
          <p className="text-lg font-medium text-blue-800 mb-4">
            Integrated Complaint Management and Tracking Portal
          </p>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Register institutional complaints, track their progress, and receive transparent updates through a centralized grievance management platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Continue to Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Enter Portal via OTP
              </Button>
            )}
            <Button onClick={() => navigate('/help')} variant="secondary" size="lg">
              View Workflow and Guidelines
            </Button>
          </div>
        </div>
      </section>

      {/* NEW: Public Grievance Status Tracker (No login required) */}
      <section className="py-10 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <FileSearch className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              Track Complaint by Reference Identifier
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Enter your official registration reference (e.g. <span className="font-mono font-semibold text-slate-700">AICTE-2026-000101</span>) to view current stage, SLA status, and timeline.
          </p>

          <form onSubmit={handlePublicTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={publicRefId}
                onChange={(e) => setPublicRefId(e.target.value)}
                placeholder="Enter Reference ID (e.g., AICTE-2026-000101)"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-hidden focus:border-blue-700 focus:ring-1 focus:ring-blue-700 font-mono uppercase"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={searchLoading}
              icon={Search}
            >
              Check Live Status
            </Button>
          </form>

          {/* Quick reference examples for jury testing */}
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-2">
            <span>Demo Reference Examples:</span>
            <button
              type="button"
              onClick={() => { setPublicRefId('AICTE-2026-000101'); }}
              className="font-mono text-blue-700 hover:underline"
            >
              AICTE-2026-000101
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => { setPublicRefId('AICTE-2026-000102'); }}
              className="font-mono text-blue-700 hover:underline"
            >
              AICTE-2026-000102
            </button>
          </div>

          {searchError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Public Search Result Card */}
          {searchResult && (
            <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono font-bold text-sm text-blue-800 block">
                    {searchResult.referenceId}
                  </span>
                  <p className="font-semibold text-slate-900 mt-0.5">{searchResult.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge status={searchResult.currentStatus}>{searchResult.currentStatus}</Badge>
                  {searchResult.slaStatus && (
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${searchResult.slaStatus.badgeClass}`}>
                      {searchResult.slaStatus.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800 block">Institution:</span>
                  <span>{searchResult.institution}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Assigned Cell:</span>
                  <span>{searchResult.assignedCell}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Filing Timestamp:</span>
                  <span>{formatDate(searchResult.createdAt)}</span>
                </div>
              </div>

              {/* Progress Stepper for Public View */}
              {searchResult.historyStages && (
                <div className="pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2 text-[11px]">
                    Chronological Progress Recorded:
                  </span>
                  <div className="space-y-2">
                    {searchResult.historyStages.map((stage, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-blue-700 mt-1.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-800">{stage.action}</span>
                          <span className="text-slate-400 text-[10px] ml-2">({formatDateTime(stage.timestamp)})</span>
                          <p className="text-slate-600 text-[11px] mt-0.5">{stage.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick Demo Access Bar for Hackathon Evaluators */}
      <section className="bg-slate-100 border-y border-slate-200 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Evaluation Access: Instant Role Sign In
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any user profile below to explore role-specific permissions and grievance workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleDemoSignIn(ROLES.STUDENT)} variant="secondary" size="sm">
                Student
              </Button>
              <Button onClick={() => handleDemoSignIn(ROLES.FACULTY)} variant="secondary" size="sm">
                Faculty
              </Button>
              <Button onClick={() => handleDemoSignIn(ROLES.STAFF)} variant="secondary" size="sm">
                Staff
              </Button>
              <Button onClick={() => handleDemoSignIn(ROLES.INSTITUTION_NODAL)} variant="secondary" size="sm">
                Nodal Officer
              </Button>
              <Button onClick={() => handleDemoSignIn(ROLES.AICTE_ADMIN)} variant="dark" size="sm">
                AICTE Admin
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key functional pillars */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto flex-1 w-full">
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional Redressal Architecture
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Built to provide structured grievance workflows across technical education institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2">
              Multi-Step Complaint Registration
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Step-by-step registration with structured classification, document uploads, and automated routing to authorized AICTE cells.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2">
              Transparent Status Timelines
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track complaint lifecycle across submission, review, institutional hearing, resolution, and closure with verified timestamps.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-2">
              Audited Resolution and Feedback
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Formal resolution summaries recorded with authorized digital sign-offs and structured 5-star complainant satisfaction audits.
            </p>
          </div>
        </div>

        {/* Supported Stakeholder Roles */}
        <div className="mt-16 bg-white border border-slate-200 rounded-lg p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            Supported Stakeholder Roles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
              <p className="font-semibold text-slate-900">Students and Scholars</p>
              <p className="text-xs text-slate-600 mt-1">
                Lodge academic, examination, scholarship, harassment, and hostel facility grievances with real-time tracking.
              </p>
            </div>

            <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
              <p className="font-semibold text-slate-900">Teaching and Research Faculty</p>
              <p className="text-xs text-slate-600 mt-1">
                Submit research funding delays, institutional compliance, and faculty welfare issues directly to AICTE bureaus.
              </p>
            </div>

            <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
              <p className="font-semibold text-slate-900">Non-Teaching Staff</p>
              <p className="text-xs text-slate-600 mt-1">
                Address administrative irregularities, duty register discrepancies, and establishment welfare concerns.
              </p>
            </div>

            <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
              <p className="font-semibold text-slate-900">Institution Nodal Officers</p>
              <p className="text-xs text-slate-600 mt-1">
                Verify institution-specific complaints, conduct internal hearings, and file formal compliance responses.
              </p>
            </div>

            <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
              <p className="font-semibold text-slate-900">Central AICTE Administrators</p>
              <p className="text-xs text-slate-600 mt-1">
                Oversee national grievance queues, assign cells, review institutional replies, and issue legally binding orders.
              </p>
            </div>

            <div className="border border-slate-200 rounded-md p-4 bg-slate-50 flex flex-col justify-center items-start">
              <Lock className="w-5 h-5 text-blue-700 mb-2" />
              <p className="font-semibold text-slate-900">Confidential Redressal</p>
              <p className="text-xs text-slate-600 mt-1">
                Sensitive harassment and student safety matters have restricted visibility and identity protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-8 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-white text-sm">AICTE SAMANVAY</p>
            <p className="text-slate-400 mt-1">
              Integrated Complaint Management and Tracking Portal. Smart India Hackathon Demonstration.
            </p>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/help" className="hover:text-white transition-colors">Help & FAQ</Link>
            <Link to="/help" className="hover:text-white transition-colors">Grievance Regulations</Link>
            <a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              AICTE Website
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
