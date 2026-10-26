import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  BarChart3,
  ThumbsUp,
  FileCheck
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input, { Textarea } from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import { getMyComplaints } from '../services/complaintService';
import { submitFeedback, getFeedbackAnalytics } from '../services/feedbackService';
import { COMPLAINT_STATUSES } from '../utils/constants';

export const FeedbackPage = () => {
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [rating, setRating] = useState(5);
  const [effectiveness, setEffectiveness] = useState(5);
  const [timeliness, setTimeliness] = useState(4);
  const [communication, setCommunication] = useState(5);
  const [fairness, setFairness] = useState(5);
  const [resolvedAdequately, setResolvedAdequately] = useState('Yes');
  const [comments, setComments] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch resolved complaints for complainant
      const [compRes, anaRes] = await Promise.all([
        getMyComplaints({ status: COMPLAINT_STATUSES.RESOLVED }),
        getFeedbackAnalytics()
      ]);

      if (compRes.success) {
        setResolvedComplaints(compRes.complaints || []);
        if (compRes.complaints && compRes.complaints.length > 0) {
          setSelectedComplaintId(compRes.complaints[0]._id);
        }
      }

      if (anaRes.success) {
        setAnalytics(anaRes);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feedback records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaintId) {
      setError('Please select an eligible resolved complaint.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await submitFeedback(selectedComplaintId, {
        rating,
        effectiveness,
        timeliness,
        communication,
        fairness,
        resolvedAdequately,
        comments
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setComments('');
        await loadData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Feedback submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedComplaint = resolvedComplaints.find(c => c._id === selectedComplaintId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Feedback and Redressal Satisfaction
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complainants are invited to rate the effectiveness, fairness, and timeliness of institutional resolutions.
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <Card
            title="Submit Post-Resolution Audit Feedback"
            subtitle="Rate each procedural dimension of your grievance inquiry"
          >
            {resolvedComplaints.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                <FileCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-800">No Eligible Complaints Awaiting Feedback</p>
                <p className="mt-1">
                  You do not currently have any resolved complaints pending satisfaction feedback. Feedback forms become available once an officer or bureau marks your grievance as Resolved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Select
                    label="Select Resolved Complaint to Review"
                    value={selectedComplaintId}
                    onChange={(e) => setSelectedComplaintId(e.target.value)}
                    options={resolvedComplaints.map(c => ({
                      value: c._id,
                      label: `${c.referenceId}: ${c.title.substring(0, 50)}...`
                    }))}
                    required
                  />
                </div>

                {selectedComplaint && selectedComplaint.resolutionSummary && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
                    <span className="font-semibold text-slate-800 block mb-0.5">Formal Resolution Recorded:</span>
                    <p className="text-slate-700">{selectedComplaint.resolutionSummary.summary}</p>
                  </div>
                )}

                {/* Overall 1 to 5 Stars */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Overall Satisfaction Rating (1 to 5 Stars) <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-md border text-sm font-bold flex items-center gap-1 transition-colors ${
                          rating >= star
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${rating >= star ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{star}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid for parameter ratings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <Select
                    label="Resolution Effectiveness"
                    value={effectiveness}
                    onChange={(e) => setEffectiveness(Number(e.target.value))}
                    options={[
                      { value: 5, label: '5: Highly Effective' },
                      { value: 4, label: '4: Effective' },
                      { value: 3, label: '3: Neutral' },
                      { value: 2, label: '2: Somewhat Ineffective' },
                      { value: 1, label: '1: Ineffective' }
                    ]}
                  />
                  <Select
                    label="Resolution Timeliness"
                    value={timeliness}
                    onChange={(e) => setTimeliness(Number(e.target.value))}
                    options={[
                      { value: 5, label: '5: Resolved Promptly' },
                      { value: 4, label: '4: Acceptable Turnaround' },
                      { value: 3, label: '3: Moderate Delay' },
                      { value: 2, label: '2: Significant Delay' },
                      { value: 1, label: '1: Unacceptable Delay' }
                    ]}
                  />
                  <Select
                    label="Officer Communication"
                    value={communication}
                    onChange={(e) => setCommunication(Number(e.target.value))}
                    options={[
                      { value: 5, label: '5: Transparent and Responsive' },
                      { value: 4, label: '4: Helpful' },
                      { value: 3, label: '3: Adequate' },
                      { value: 2, label: '2: Poor Communication' },
                      { value: 1, label: '1: No Communication' }
                    ]}
                  />
                  <Select
                    label="Fairness of Inquiry"
                    value={fairness}
                    onChange={(e) => setFairness(Number(e.target.value))}
                    options={[
                      { value: 5, label: '5: Completely Fair and Impartial' },
                      { value: 4, label: '4: Fair' },
                      { value: 3, label: '3: Moderate' },
                      { value: 2, label: '2: Biased' },
                      { value: 1, label: '1: Highly Prejudiced' }
                    ]}
                  />
                </div>

                <div>
                  <Select
                    label="Was your issue adequately resolved?"
                    value={resolvedAdequately}
                    onChange={(e) => setResolvedAdequately(e.target.value)}
                    options={[
                      { value: 'Yes', label: 'Yes: Satisfactorily Resolved' },
                      { value: 'Partially', label: 'Partially: Only Part of Issue Addressed' },
                      { value: 'No', label: 'No: Not Resolved' }
                    ]}
                    required
                  />
                </div>

                <Textarea
                  label="Detailed Feedback and Suggestions (Optional)"
                  placeholder="Share constructive comments regarding the institutional redressal experience..."
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={submitting}
                  icon={CheckCircle2}
                >
                  Submit Official Feedback
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Analytics Summary Column */}
        <div className="space-y-6">
          <Card
            title="Institutional Satisfaction Metrics"
            subtitle="Public aggregate metrics from complainant audits"
          >
            {analytics?.summary ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                    Average Complainant Rating
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1 flex items-center justify-center gap-1">
                    <span>{analytics.summary.averageRating}</span>
                    <span className="text-sm text-slate-500 font-normal">/ 5.0</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          analytics.summary.averageRating >= s ? 'fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Adequate Resolution Rate:</span>
                    <span className="font-bold text-emerald-800">
                      {analytics.summary.adequateResolutionPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Mean Effectiveness:</span>
                    <span className="font-bold text-slate-800">
                      {analytics.summary.averageEffectiveness} / 5
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Mean Timeliness:</span>
                    <span className="font-bold text-slate-800">
                      {analytics.summary.averageTimeliness} / 5
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600 font-medium">Total Audited Feedbacks:</span>
                    <span className="font-bold text-slate-800">
                      {analytics.summary.totalFeedback}
                    </span>
                  </div>
                </div>

                {/* Rating Distribution */}
                {analytics.ratingDistribution && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                      Star Breakdown
                    </span>
                    <div className="space-y-1.5 text-[11px]">
                      {analytics.ratingDistribution.map((item) => (
                        <div key={item.stars} className="flex items-center gap-2">
                          <span className="w-14 text-slate-600">{item.stars}</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-sm overflow-hidden">
                            <div
                              className="h-full bg-amber-500"
                              style={{
                                width: `${analytics.summary.totalFeedback > 0 ? (item.count / analytics.summary.totalFeedback) * 100 : 0}%`
                              }}
                            />
                          </div>
                          <span className="w-6 text-right font-medium text-slate-700">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">Loading metrics...</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
