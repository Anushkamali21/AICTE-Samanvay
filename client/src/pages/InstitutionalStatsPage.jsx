import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Filter,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { getInstitutionalStats } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../utils/constants';

export const InstitutionalStatsPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    total: 0,
    open: 0,
    underReview: 0,
    resolved: 0,
    escalated: 0,
    resolutionRate: 0,
    averageResolutionDays: 0
  });
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getInstitutionalStats();
        if (res.success) {
          setMetrics(res.metrics || {});
          setCategoryDistribution(res.categoryDistribution || []);
          setDepartmentDistribution(res.departmentDistribution || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load institutional analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional Complaint Statistics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated grievance performance metrics calculated across verified institutional records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.print()} variant="secondary" size="sm" icon={Download}>
            Export Audit Report
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
          {error}
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Resolution Rate
          </span>
          <div className="text-3xl font-extrabold text-emerald-800 mt-2">
            {metrics.resolutionRate}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complaints successfully closed with formal resolution
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Average Resolution Time
          </span>
          <div className="text-3xl font-extrabold text-blue-800 mt-2">
            {metrics.averageResolutionDays} Days
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mean turnaround from filing to formal order
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Active Open Cases
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {metrics.open}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grievances currently progressing through inquiry
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Escalated Cases
          </span>
          <div className="text-3xl font-extrabold text-red-700 mt-2">
            {metrics.escalated}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Transferred to Central AICTE Bureau for intervention
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card
          title="Complaints by Category"
          subtitle="Frequency of grievances registered across standardized categories"
        >
          {categoryDistribution.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-xs text-slate-400">
              No category metrics recorded.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={130}
                    tick={{ fontSize: 10, fill: '#334155' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', fontSize: '12px', borderRadius: '6px' }}
                  />
                  <Bar dataKey="count" name="Complaints" fill="#1d4ed8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Department Breakdown */}
        <Card
          title="Department-wise Distribution"
          subtitle="Complaints mapped to target departments and administrative sections"
        >
          {departmentDistribution.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-xs text-slate-400">
              No departmental distribution data.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentDistribution} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={130}
                    tick={{ fontSize: 10, fill: '#334155' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', fontSize: '12px', borderRadius: '6px' }}
                  />
                  <Bar dataKey="count" name="Complaints" fill="#0284c7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InstitutionalStatsPage;
