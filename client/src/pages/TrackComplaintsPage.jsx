import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileSearch,
  Filter,
  FilePlus2,
  RefreshCw,
  Search,
  Calendar
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import { getMyComplaints } from '../services/complaintService';
import { formatDate } from '../utils/formatters';
import {
  COMPLAINT_STATUSES,
  COMPLAINT_CATEGORIES
} from '../utils/constants';

export const TrackComplaintsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await getMyComplaints(params);
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve complaint records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const columns = [
    {
      header: 'Complaint Reference',
      key: 'referenceId',
      render: (val, row) => (
        <div>
          <span className="font-bold text-blue-700">{val}</span>
          <p className="text-xs text-slate-800 line-clamp-1 mt-0.5">{row.title}</p>
        </div>
      )
    },
    {
      header: 'Category',
      key: 'category',
      render: (val) => <span className="text-slate-700">{val}</span>
    },
    {
      header: 'Target Institution',
      key: 'institution',
      render: (val) => <span className="text-slate-600 text-xs">{val}</span>
    },
    {
      header: 'Lodged On',
      key: 'createdAt',
      render: (val) => formatDate(val)
    },
    {
      header: 'Status',
      key: 'currentStatus',
      render: (val) => <Badge status={val}>{val}</Badge>
    },
    {
      header: 'Last Update',
      key: 'updatedAt',
      render: (val) => formatDate(val)
    },
    {
      header: 'Action',
      key: '_id',
      render: (val) => (
        <Button
          onClick={() => navigate(`/complaints/${val}`)}
          variant="secondary"
          size="sm"
        >
          View Case
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Track My Complaints
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status tracking and communication logs for your filed institutional grievances.
          </p>
        </div>
        <Button
          onClick={() => navigate('/complaints/new')}
          variant="primary"
          size="md"
          icon={FilePlus2}
        >
          Lodge New Grievance
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white" bodyClassName="p-0">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <form onSubmit={handleSearchSubmit} className="sm:col-span-2 relative">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Search by Keyword or Reference
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaint ID or subject..."
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
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
          {error}
        </div>
      )}

      {/* Records Table */}
      <Table
        columns={columns}
        data={complaints}
        isLoading={loading}
        emptyMessage="No grievances matching your selected criteria were found in your records."
      />
    </div>
  );
};

export default TrackComplaintsPage;
