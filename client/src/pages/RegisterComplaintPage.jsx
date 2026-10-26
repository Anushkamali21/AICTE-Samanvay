import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Download,
  FileCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input, { Textarea } from '../components/common/Input';
import Select from '../components/common/Select';
import StepIndicator from '../components/common/StepIndicator';
import { useAuth } from '../context/AuthContext';
import { createComplaint, checkDuplicates, uploadDocument } from '../services/complaintService';
import {
  COMPLAINT_CATEGORIES,
  SENSITIVE_CATEGORIES,
  PRIORITIES,
  TARGET_TYPES,
  ROLE_LABELS
} from '../utils/constants';
import { formatDate } from '../utils/formatters';

const STEPS = [
  { id: 'complainant', title: '1. Complainant Info' },
  { id: 'classification', title: '2. Classification' },
  { id: 'details', title: '3. Complaint Details' },
  { id: 'review', title: '4. Review & Submit' },
  { id: 'confirmation', title: '5. Confirmation' }
];

export const RegisterComplaintPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: user?.name || '',
    role: user?.role || 'student',
    institution: user?.institution || '',
    institutionId: user?.institutionId || 'INST-001',
    department: user?.department || '',
    email: user?.email || '',
    mobile: user?.mobile || '',

    // Step 2
    category: '',

    // Step 3
    title: '',
    description: '',
    targetType: 'Institution',
    priority: 'Normal',
    expectedResolution: '',
    incidentDate: new Date().toISOString().split('T')[0],

    // Step 4 declaration
    declarationAgreed: false
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [duplicateMatches, setDuplicateMatches] = useState([]);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        role: user.role || 'student',
        institution: user.institution || '',
        institutionId: user.institutionId || 'INST-001',
        department: user.department || '',
        email: user.email || '',
        mobile: user.mobile || ''
      }));
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Run duplicate detection check when moving from Step 3 to Step 4
  const handleCheckDuplicatesAndNext = async () => {
    setError('');
    if (!formData.title.trim()) {
      setError('Please provide a descriptive complaint title.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      setError('Please describe the complaint in detail (at least 20 characters).');
      return;
    }

    try {
      setLoading(true);
      const res = await checkDuplicates({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        institution: formData.institution
      });
      if (res.success && res.matches) {
        setDuplicateMatches(res.matches);
      }
      setCurrentStep(4);
    } catch (err) {
      console.warn('Duplicate checking encountered error:', err);
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setError('');
    if (!formData.declarationAgreed) {
      setError('You must confirm the accuracy declaration before submitting.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        targetType: formData.targetType,
        institution: formData.institution.trim(),
        department: formData.department.trim(),
        incidentDate: formData.incidentDate,
        priority: formData.priority,
        expectedResolution: formData.expectedResolution.trim()
      };

      const res = await createComplaint(payload);
      if (res.success && res.complaint) {
        const created = res.complaint;

        // If file selected, upload document
        if (selectedFile) {
          const fileData = new FormData();
          fileData.append('document', selectedFile);
          try {
            await uploadDocument(created._id, fileData);
          } catch (uploadErr) {
            console.warn('Document upload encountered issue:', uploadErr);
          }
        }

        setSubmittedComplaint(created);
        setCurrentStep(5);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const isSensitive = SENSITIVE_CATEGORIES.includes(formData.category);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Register a Formal Institutional Complaint
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complaints are logged in the central AICTE grievance database and routed to authorized bureaus.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: COMPLAINANT INFORMATION */}
      {currentStep === 1 && (
        <Card
          title="Step 1: Complainant Information"
          subtitle="Profile details verified through your authenticated institutional credentials"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              disabled
              helperText="Verified against institutional identity record."
            />
            <Input
              label="Stakeholder Role"
              value={ROLE_LABELS[formData.role] || formData.role}
              disabled
              helperText="Registered authorization role."
            />
            <Input
              label="Institution Name"
              value={formData.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              required
              helperText="Affiliated technical education institution."
            />
            <Input
              label="Institution Code / ID"
              value={formData.institutionId}
              onChange={(e) => handleChange('institutionId', e.target.value)}
              helperText="Institutional AISHE or AICTE identifier."
            />
            <Input
              label="Department / Branch"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              placeholder="e.g. Computer Science, Finance"
            />
            <Input
              label="Institutional Email"
              type="email"
              value={formData.email}
              disabled
              helperText="System notifications will be logged to this address."
            />
            <Input
              label="Primary Mobile Number"
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              required
              helperText="Used for status verification."
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                if (!formData.institution.trim()) {
                  setError('Institution name is required.');
                  return;
                }
                setError('');
                setCurrentStep(2);
              }}
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
            >
              Proceed to Classification
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: CLASSIFICATION */}
      {currentStep === 2 && (
        <Card
          title="Step 2: Complaint Classification"
          subtitle="Select the specific category matching your grievance"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Available Grievance Categories <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      handleChange('category', cat);
                      setError('');
                    }}
                    className={`p-3.5 rounded-lg border text-left text-xs font-medium transition-all ${
                      formData.category === cat
                        ? 'border-blue-700 bg-blue-50/70 text-blue-900 ring-1 ring-blue-700 font-semibold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{cat}</span>
                      {SENSITIVE_CATEGORIES.includes(cat) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          Confidential
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {isSensitive && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3 text-xs text-amber-900">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Confidentiality Protection Active</p>
                  <p className="mt-0.5 text-amber-800">
                    Complaints classified under sensitive categories receive restricted routing. Complainant identity details are protected from general institutional queries and accessed strictly by authorized grievance committees.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="secondary"
              size="md"
              icon={ArrowLeft}
            >
              Back to Information
            </Button>
            <Button
              onClick={() => {
                if (!formData.category) {
                  setError('Please select a complaint category to proceed.');
                  return;
                }
                setError('');
                setCurrentStep(3);
              }}
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
            >
              Proceed to Details
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: COMPLAINT DETAILS */}
      {currentStep === 3 && (
        <Card
          title="Step 3: Complaint Details"
          subtitle="Provide factual information, target details, and supporting evidence"
        >
          <div className="space-y-4">
            <Input
              label="Complaint Subject / Title"
              placeholder="e.g., Delay in issuance of degree certificate despite clearance"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              helperText="Be concise and specific (maximum 200 characters)."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Target of Grievance"
                value={formData.targetType}
                onChange={(e) => handleChange('targetType', e.target.value)}
                options={TARGET_TYPES}
                required
              />
              <Select
                label="Urgency / Priority"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                options={PRIORITIES}
                required
              />
              <Input
                label="Date of Incident / Occurrence"
                type="date"
                value={formData.incidentDate}
                onChange={(e) => handleChange('incidentDate', e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Detailed Narrative of Grievance"
              placeholder="Explain the chronology of events, communications attempted, and specific institutional clauses violated..."
              rows={5}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              helperText="Include relevant dates, roll numbers, or reference letters."
            />

            <Textarea
              label="Expected Redressal / Remedy Sought"
              placeholder="State the resolution you expect from the institutional committee..."
              rows={2}
              value={formData.expectedResolution}
              onChange={(e) => handleChange('expectedResolution', e.target.value)}
            />

            {/* Document Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Supporting Evidence / Documentation (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-700 transition-colors bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">
                  Upload PDF, JPG, or PNG files (Maximum file size: 5 MB)
                </p>
                <input
                  type="file"
                  id="docUpload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="docUpload"
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  Browse Document
                </label>
                {selectedFile && (
                  <p className="mt-2 text-xs font-semibold text-blue-700">
                    Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="secondary"
              size="md"
              icon={ArrowLeft}
            >
              Back to Classification
            </Button>
            <Button
              onClick={handleCheckDuplicatesAndNext}
              variant="primary"
              size="md"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Review Information
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: REVIEW & SUBMISSION */}
      {currentStep === 4 && (
        <Card
          title="Step 4: Review and Formal Submission"
          subtitle="Verify all particulars before lodging your grievance in the central registry"
        >
          <div className="space-y-6">
            {/* Duplicate detection warning notice if found */}
            {duplicateMatches.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Potential Similar Grievances Detected</span>
                </div>
                <p className="text-amber-800">
                  Our system identified {duplicateMatches.length} existing complaint(s) with similar themes at your institution. You may still proceed with your submission; officers will cross-reference if applicable.
                </p>
                <div className="mt-2 space-y-1">
                  {duplicateMatches.slice(0, 2).map((dup) => (
                    <div key={dup.referenceId} className="bg-white/80 p-2 rounded border border-amber-200">
                      <span className="font-semibold text-slate-800">{dup.referenceId}</span>: {dup.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Summary Table */}
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 text-xs">
              <div className="p-3 bg-slate-50 font-bold uppercase tracking-wider text-slate-700">
                Grievance Summary
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="font-semibold text-slate-500">Complainant:</span>
                <span className="col-span-2 text-slate-900">{formData.fullName} ({ROLE_LABELS[formData.role] || formData.role})</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="font-semibold text-slate-500">Institution:</span>
                <span className="col-span-2 text-slate-900">{formData.institution}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="font-semibold text-slate-500">Category:</span>
                <span className="col-span-2 font-semibold text-blue-700">{formData.category}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="font-semibold text-slate-500">Subject / Title:</span>
                <span className="col-span-2 font-semibold text-slate-900">{formData.title}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="font-semibold text-slate-500">Narrative:</span>
                <span className="col-span-2 text-slate-700 whitespace-pre-wrap">{formData.description}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="font-semibold text-slate-500">Target & Priority:</span>
                <span className="col-span-2 text-slate-900">{formData.targetType} | Priority: {formData.priority}</span>
              </div>
              <div className="p-3 grid grid-cols-3">
                <span className="font-semibold text-slate-500">Expected Remedy:</span>
                <span className="col-span-2 text-slate-700">{formData.expectedResolution || 'None specified'}</span>
              </div>
              {selectedFile && (
                <div className="p-3 grid grid-cols-3">
                  <span className="font-semibold text-slate-500">Attachment:</span>
                  <span className="col-span-2 text-blue-700 font-medium">{selectedFile.name}</span>
                </div>
              )}
            </div>

            {/* Declaration Checkbox */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.declarationAgreed}
                  onChange={(e) => handleChange('declarationAgreed', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-slate-300 text-blue-700 focus:ring-blue-700"
                />
                <span className="text-xs text-slate-700 leading-relaxed select-none">
                  I solemnly declare that all particulars submitted in this complaint are factual and true to the best of my knowledge. I understand that submitting false, misleading, or frivolous representations is subject to institutional conduct regulations.
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              onClick={() => setCurrentStep(3)}
              variant="secondary"
              size="md"
              icon={ArrowLeft}
            >
              Edit Details
            </Button>
            <Button
              onClick={handleFinalSubmit}
              variant="primary"
              size="md"
              loading={loading}
              disabled={!formData.declarationAgreed}
              icon={CheckCircle2}
            >
              Submit Complaint
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: CONFIRMATION & ACKNOWLEDGEMENT */}
      {currentStep === 5 && submittedComplaint && (
        <Card className="text-center py-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mb-4 ring-8 ring-emerald-50">
            <FileCheck className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Grievance Registered Successfully
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Your complaint has been assigned to the central intake queue and an official acknowledgment record has been established.
          </p>

          <div className="max-w-md mx-auto my-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Reference ID:</span>
              <span className="font-bold text-blue-700 text-sm">{submittedComplaint.referenceId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Filing Timestamp:</span>
              <span className="text-slate-800">{formatDate(submittedComplaint.createdAt)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Assigned Cell:</span>
              <span className="text-slate-800">{submittedComplaint.assignedCell}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Current Status:</span>
              <span className="font-semibold text-emerald-700">{submittedComplaint.currentStatus}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => navigate(`/complaints/${submittedComplaint._id}`)}
              variant="primary"
              size="md"
            >
              Track This Complaint
            </Button>
            <Button
              onClick={() => window.print()}
              variant="secondary"
              size="md"
              icon={Download}
            >
              Print Acknowledgement Receipt
            </Button>
            <Button
              onClick={() => {
                setSubmittedComplaint(null);
                setCurrentStep(1);
              }}
              variant="text"
              size="md"
            >
              Register Another Grievance
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegisterComplaintPage;
