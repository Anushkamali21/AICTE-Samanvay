import React, { useState } from 'react';
import {
  User,
  Shield,
  Building2,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatters';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [mobile, setMobile] = useState(user?.mobile || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      setLoading(true);
      const res = await updateProfile({ mobile, department });
      if (res.success) {
        setSuccessMsg('Profile details successfully updated.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          User Profile and Institutional Credentials
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your authenticated identity attributes and permitted contact configurations.
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
        {/* Left Identity Card */}
        <div className="space-y-6">
          <Card title="Stakeholder Credential" subtitle="Institutional verification status">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">
                {ROLE_LABELS[user?.role] || user?.role}
              </p>
              <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm font-semibold">
                Account Active & Verified
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3 text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-500">Member Since:</span>
                <span className="text-slate-800 font-medium">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Institution Code:</span>
                <span className="text-slate-800 font-medium">{user?.institutionId || 'INST-001'}</span>
              </div>
            </div>
          </Card>

          <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Security Notice:</span>
              Institutional affiliations and stakeholder roles are cryptographically governed. To request role reallocation, contact your institution nodal authority.
            </div>
          </div>
        </div>

        {/* Right Editable Details Form */}
        <div className="lg:col-span-2">
          <Card
            title="Account Parameters"
            subtitle="Editable contact settings and immutable regulatory records"
          >
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Legal Name"
                  value={user?.name || ''}
                  disabled
                  helperText="Managed by institutional registrar."
                />
                <Input
                  label="Registered Email Address"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  helperText="Primary address for official dispatch."
                />
                <Input
                  label="Affiliated Institution"
                  value={user?.institution || ''}
                  disabled
                  helperText="Designated technical education campus."
                />
                <Input
                  label="Stakeholder Role"
                  value={ROLE_LABELS[user?.role] || user?.role}
                  disabled
                  helperText="Role-based permissions level."
                />
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Permitted Updates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Contact Number"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    helperText="Receives one-time login codes."
                  />
                  <Input
                    label="Department / Faculty Branch"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Mechanical Engineering"
                    helperText="Academic or administrative unit."
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  icon={Save}
                >
                  Save Profile Modifications
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
