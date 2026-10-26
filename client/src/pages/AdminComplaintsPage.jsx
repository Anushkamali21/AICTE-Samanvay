import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  RefreshCw,
  Download,
  Link2
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import { getAdminComplaints } from '../services/complaintService';
import { formatDate } from '../utils/formatters';
import { exportComplaintsToCSV } from '../utils/csvExport';
import { useAuth } from '../context/AuthContext';
import {
  COMPLAINT_STATUSES,
  COMPLAINT_CATEGORIES,
  PRIORITIES,
  ROLES,
  ROLE_LABELS
} from '../utils/constants';

export const AdminComplaintsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await getAdminComplaints(params);
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administrative triage queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQueue();
  };

  const handleExportCSV = () => {
    exportComplaintsToCSV(complaints, `aicte_grievance_roster_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const columns = [
    {
      header: 'Case Reference',
      key: 'referenceId',
      render: (val, row) => (
        <div>
          <span className="font-extrabold text-blue-700 font-mono">{val}</span>
          <p className="text-xs font-semibold text-slate-900 mt-0.5 line-clamp-1">{row.title}</p>
          {row.linkedCases && row.linkedCases.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 mt-0.5 font-semibold">
              <Link2 className="w-3 h-3" /> Bundled ({row.linkedCases.length})
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Complainant',
      key: 'complainantName',
      render: (val, row) => (
        <div>
          <span className="text-slate-800 font-medium">{val}</span>
          <p className="text-[10px] text-slate-500">{ROLE_LABELS[row.complainantRole] || row.complainantRole}</p>
        </div>
      )
    },
    {
      header: 'Institution & Cell',
      key: 'institution',
      render: (val, row) => (
        <div>
          <span className="text-slate-700 text-xs block truncate max-w-[160px]">{val}</span>
          <span className="text-[10px] text-blue-700 font-medium">{row.assignedCell}</span>
        </div>
      )
    },
    {
      header: 'Category',
      key: 'category',
      render: (val) => <span className="text-xs text-slate-700">{val}</span>
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (val) => (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm border ${
          val === 'Urgent'
            ? 'bg-red-50 text-red-700 border-red-200'
            : val === 'High'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: 'Current Status & SLA',
      key: 'currentStatus',
      render: (val, row) => (
        <div className="space-y-1">
          <Badge status={val}>{val}</Badge>
          {row.slaStatus && (
            <div className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${row.slaStatus.badgeClass}`}>
              {row.slaStatus.label}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Filing Date',
      key: 'createdAt',
      render: (val) => formatDate(val)
    },
    {
      header: 'Action',
      key: '_id',
      render: (val) => (
        <Button
          onClick={() => navigate(`/complaints/${val}`)}
          variant="primary"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
        >
          Process
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Administrative Grievance Workbench
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-sm bg-blue-50 text-blue-800 font-semibold border border-blue-200">
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authorized queue for case assignment, regulatory hearings, status transitions, and formal redressal orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleExportCSV} variant="secondary" size="sm" icon={Download}>
            Export Roster (CSV)
          </Button>
          <Button onClick={fetchQueue} variant="secondary" size="sm" icon={RefreshCw}>
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card bodyClassName="p-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <form onSubmit={handleSearchSubmit} className="relative">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Search by Keyword or Reference
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Reference ID or title..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-hidden focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
              />
            </div>
          </form>

          <div>
            <Select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="All Statuses"
              options={Object.values(COMPLAINT_STATUSES).map(s => ({ value: s, label: s }))}
            />
          </div>

          <div>
            <Select
              label="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="All Categories"
              options={COMPLAINT_CATEGORIES.map(c => ({ value: c, label: c }))}
            />
          </div>

          <div>
            <Select
              label="Filter by Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              placeholder="All Priorities"
              options={PRIORITIES.map(p => ({ value: p, label: p }))}
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
          {error}
        </div>
      )}

      {/* Queue Table */}
      <Table
        columns={columns}
        data={complaints}
        isLoading={loading}
        emptyMessage="No grievances matching the selected filters were found in your jurisdictional queue."
      />
    </div>
  );
};

export default AdminComplaintsPage;
