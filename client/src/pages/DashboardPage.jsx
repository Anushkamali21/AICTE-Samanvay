import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  FilePlus2,
  FileSearch,
  BarChart3,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/analyticsService';
import { formatDate } from '../utils/formatters';
import { ROLE_LABELS, ROLES } from '../utils/constants';

// Distinct institutional solid colors for Pie slices
const STATUS_COLORS_MAP = {
  'Submitted': '#64748b',
  'Acknowledged': '#1d4ed8',
  'Under Review': '#4338ca',
  'Assigned to Officer': '#0284c7',
  'Awaiting Institution Response': '#b45309',
  'In Progress': '#0891b2',
  'Escalated': '#b91c1c',
  'Resolved': '#15803d',
  'Closed': '#475569',
  'Reopened': '#c2410c'
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    resolved: 0,
    awaitingAction: 0
  });
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await getDashboardStats();
        if (res.success) {
          setStats(res.stats);
          setStatusDistribution(res.statusDistribution || []);
          setMonthlyTrends(res.monthlyTrends || []);
          setRecentComplaints(res.recentComplaints || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const isStaffOrStudent = [ROLES.STUDENT, ROLES.FACULTY, ROLES.STAFF].includes(user?.role);

  const columns = [
    {
      header: 'Complaint ID',
      key: 'referenceId',
      render: (val, row) => (
        <span className="font-semibold text-blue-700">{val}</span>
      )
    },
    {
      header: 'Category',
      key: 'category',
      render: (val) => <span className="text-slate-800">{val}</span>
    },
    {
      header: 'Submission Date',
      key: 'createdAt',
      render: (val) => formatDate(val)
    },
    {
      header: 'Current Status',
      key: 'currentStatus',
      render: (val) => <Badge status={val}>{val}</Badge>
    },
    {
      header: 'Last Updated',
      key: 'updatedAt',
      render: (val) => formatDate(val)
    },
    {
      header: 'Action',
      key: 'actions',
      render: (_, row) => (
        <Button
          onClick={() => navigate(`/complaints/${row._id}`)}
          variant="secondary"
          size="sm"
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-sm bg-blue-50 text-blue-800 font-semibold border border-blue-200">
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {user?.institution} {user?.department ? `(${user.department})` : ''}
          </p>
        </div>

        {/* Quick Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isStaffOrStudent && (
            <Button
              onClick={() => navigate('/complaints/new')}
              variant="primary"
              size="md"
              icon={FilePlus2}
            >
              Register New Complaint
            </Button>
          )}
          <Button
            onClick={() => navigate(isStaffOrStudent ? '/complaints' : '/admin/complaints')}
            variant="secondary"
            size="md"
            icon={FileSearch}
          >
            {isStaffOrStudent ? 'Track Complaints' : 'Triage Queue'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
          {error}
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Complaints
            </span>
            <div className="p-2 rounded-md bg-slate-100 text-slate-700">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-xs text-slate-500 mt-1">
              Registered across active records
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Under Review
            </span>
            <div className="p-2 rounded-md bg-blue-50 text-blue-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-800">{stats.underReview}</div>
            <p className="text-xs text-slate-500 mt-1">
              Currently assigned or in verification
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resolved Cases
            </span>
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-800">{stats.resolved}</div>
            <p className="text-xs text-slate-500 mt-1">
              Formal resolution granted and closed
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Awaiting Action
            </span>
            <div className="p-2 rounded-md bg-amber-50 text-amber-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-800">{stats.awaitingAction}</div>
            <p className="text-xs text-slate-500 mt-1">
              Escalated or pending institution reply
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card
          title="Complaint Status Distribution"
          subtitle="Proportional breakdown across verified lifecycle statuses"
          headerClassName="bg-slate-50/50"
        >
          {statusDistribution.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No status records available to chart.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={2}
                  >
                    {statusDistribution.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS_MAP[entry.name] || '#3b82f6'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', fontSize: '12px', borderRadius: '6px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Monthly Complaint Trends */}
        <Card
          title="Monthly Complaint Trends"
          subtitle="Registered vs resolved cases over the tracking period"
          headerClassName="bg-slate-50/50"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', fontSize: '12px', borderRadius: '6px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="registered" name="Registered" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#15803d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Complaints Table */}
      <Card
        title="Recent Complaints"
        subtitle="Most recent grievance cases in your authorized scope"
        action={
          <Button
            onClick={() => navigate(isStaffOrStudent ? '/complaints' : '/admin/complaints')}
            variant="secondary"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
          >
            View All Records
          </Button>
        }
      >
        <Table
          columns={columns}
          data={recentComplaints}
          isLoading={loading}
          emptyMessage="No recent complaints found in this category."
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
