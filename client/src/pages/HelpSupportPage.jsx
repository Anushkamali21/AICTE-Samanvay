import React, { useState } from 'react';
import {
  HelpCircle,
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  Send
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input, { Textarea } from '../components/common/Input';
import { COMPLAINT_STATUSES } from '../utils/constants';

export const HelpSupportPage = () => {
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [supportContact, setSupportContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportSubject || !supportDescription) return;
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How do I register a formal complaint?',
      a: 'Navigate to "Register a Complaint" from the sidebar or dashboard. The wizard guides you through five clear steps: confirming your complainant details, selecting the complaint classification, entering the grievance narrative with optional evidence, reviewing the declaration, and receiving your official reference number.'
    },
    {
      q: 'How does the unique complaint reference format work?',
      a: 'Each complaint is assigned an immutable alphanumeric identifier in the format AICTE-[YEAR]-[SEQUENCE] (for example, AICTE-2026-000101) upon server ingestion. This reference must be cited in all institutional hearings and follow-ups.'
    },
    {
      q: 'How are sensitive harassment or misconduct grievances handled?',
      a: 'Complaints classified under "Harassment, Discrimination, or Misconduct" or "Safety and Student Welfare" activate strict confidentiality masking. Complainant identities are protected from unauthorized institutional queries and routed directly to specialized regulatory cells.'
    },
    {
      q: 'When does a complaint get escalated?',
      a: 'Complaints are escalated to the Central AICTE Grievance Bureau if the target institution fails to respond within the designated procedural SLA window, or if an authorized officer identifies severe compliance violations requiring direct council intervention.'
    },
    {
      q: 'Can a complaint be reopened after resolution?',
      a: 'Yes. If a formal resolution has been issued but the underlying remedy was unfulfilled or flawed, eligible complainants may submit a Reopening Request with factual justification from the complaint detail workbench.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Help and Support Documentation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Operational guidelines, regulatory redressal procedures, and technical assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main FAQ & Workflow Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Guide */}
          <Card
            title="Complaint Lifecycle & Workflow Stages"
            subtitle="Understand how complaints progress from intake to formal closure"
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="font-bold text-slate-800">1. Intake & Acknowledgment:</span>
                <p className="text-slate-600 mt-0.5">
                  Complaint is cryptographically logged, assigned a unique reference ID, and matched against existing institutional filings.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="font-bold text-slate-800">2. Review & Routing:</span>
                <p className="text-slate-600 mt-0.5">
                  Central bureau evaluates jurisdiction and assigns the matter to the appropriate Bureau or Institution Nodal Officer.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="font-bold text-slate-800">3. Inquiry & Institutional Hearing:</span>
                <p className="text-slate-600 mt-0.5">
                  The institution produces factual documentation, assessment records, or administrative justification.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="font-bold text-slate-800">4. Formal Resolution & Satisfaction Audit:</span>
                <p className="text-slate-600 mt-0.5">
                  Authorized officers issue binding orders. Complainants submit a 5-dimension satisfaction audit to record effectiveness.
                </p>
              </div>
            </div>
          </Card>

          {/* Frequently Asked Questions */}
          <Card
            title="Frequently Asked Questions (FAQ)"
            subtitle="Common questions regarding institutional grievance redressal"
          >
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    {faq.q}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Support Request Form & Contact Info */}
        <div className="space-y-6">
          {/* Official AICTE Information */}
          <Card
            title="Official Council Contacts"
            subtitle="Verified regulatory coordinates"
          >
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">AICTE Headquarters:</span>
                  <p>Nelson Mandela Marg, Vasant Kunj, New Delhi, 110070</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Official Portal:</span>
                  <a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                    www.aicte-india.org
                  </a>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-[11px] text-blue-900">
                <span className="font-bold block mb-0.5">Demonstration Environment Notice:</span>
                This portal is configured for Smart India Hackathon evaluation. External SMS gateways and email relays operate in local demonstration mode.
              </div>
            </div>
          </Card>

          {/* Technical Help Ticket Form */}
          <Card
            title="Portal Technical Support"
            subtitle="Report technical bugs or portal accessibility difficulties"
          >
            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-center text-xs text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                <p className="font-bold">Support Request Logged</p>
                <p className="mt-1">
                  Your ticket has been recorded for technical review.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSupportSubject('');
                    setSupportDescription('');
                  }}
                  className="mt-3 text-blue-700 font-semibold hover:underline"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-3">
                <Input
                  label="Subject / Topic"
                  placeholder="e.g. Difficulty uploading PDF marksheets"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  required
                />
                <Textarea
                  label="Description of Technical Issue"
                  placeholder="Detail the error message, browser, and steps..."
                  rows={3}
                  value={supportDescription}
                  onChange={(e) => setSupportDescription(e.target.value)}
                  required
                />
                <Input
                  label="Contact Email or Phone"
                  placeholder="e.g. student@samanvay.demo"
                  value={supportContact}
                  onChange={(e) => setSupportContact(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full mt-2"
                  icon={Send}
                >
                  Send Technical Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
