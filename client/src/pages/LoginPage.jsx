import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Smartphone,
  KeyRound,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useAuth } from '../context/AuthContext';
import { requestOtp } from '../services/authService';
import { ROLES, ROLE_LABELS } from '../utils/constants';

export const LoginPage = () => {
  const [step, setStep] = useState('identifier'); // 'identifier' or 'otp'
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState(ROLES.STUDENT);
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState('');

  const { loginWithOtp, quickDemoLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!identifier.trim()) {
      setError('Please provide a valid institutional email address or mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await requestOtp(identifier.trim());
      if (res.success) {
        setStep('otp');
        setCountdown(30);
        setSuccessMsg(res.message);
        if (res.demoCode) {
          setDemoCodeHint(res.demoCode);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to request OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginWithOtp(identifier.trim(), otp.trim(), {
        role,
        name: name.trim() || undefined,
        institution: institution.trim() || undefined
      });
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (selectedRole) => {
    setError('');
    try {
      setLoading(true);
      await quickDemoLogin(selectedRole);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-md bg-blue-700 flex items-center justify-center text-white font-bold text-base shadow-xs">
            AS
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">AICTE SAMANVAY</span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Sign In to Grievance Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered institutional email or mobile number to receive a verification OTP.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200 rounded-lg shadow-xs">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p>{successMsg}</p>
                {demoCodeHint && (
                  <p className="font-bold mt-1 text-emerald-900">
                    Generated Demonstration Code: {demoCodeHint}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 'identifier' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <Input
                  label="Institutional Email or Mobile"
                  placeholder="e.g., student@samanvay.demo or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  helperText="Use your affiliated institution email or primary registered phone."
                />
              </div>

              <div>
                <Select
                  label="Intended Stakeholder Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={[
                    { value: ROLES.STUDENT, label: 'Student' },
                    { value: ROLES.FACULTY, label: 'Faculty / Teacher' },
                    { value: ROLES.STAFF, label: 'Non-Teaching Staff' }
                  ]}
                  helperText="Select your current institutional affiliation."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="w-full mt-2"
                icon={ArrowRight}
                iconPosition="right"
              >
                Request Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Verifying:</span> {identifier}
                <button
                  type="button"
                  onClick={() => { setStep('identifier'); setOtp(''); }}
                  className="block text-blue-700 hover:underline mt-1 font-medium"
                >
                  Change Email or Mobile
                </button>
              </div>

              <div>
                <Input
                  label="Six-Digit Verification Code (OTP)"
                  placeholder="Enter 6-digit code (e.g. 123456)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  helperText="For demo evaluation, code 123456 is always accepted."
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {countdown > 0 ? `Resend available in ${countdown}s` : 'Did not receive code?'}
                </span>
                <button
                  type="button"
                  disabled={countdown > 0 || loading}
                  onClick={handleRequestOtp}
                  className="text-blue-700 hover:underline font-medium disabled:text-slate-400 disabled:no-underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend OTP</span>
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="w-full mt-2"
                icon={CheckCircle2}
              >
                Verify and Access Dashboard
              </Button>
            </form>
          )}

          {/* Quick Evaluator Access */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              <Users className="w-3.5 h-3.5 text-blue-700" />
              <span>Instant Evaluator Sign In</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              One-click access for Smart India Hackathon review without requiring SMS delivery:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button onClick={() => handleQuickLogin(ROLES.STUDENT)} variant="secondary" size="sm">
                Student
              </Button>
              <Button onClick={() => handleQuickLogin(ROLES.FACULTY)} variant="secondary" size="sm">
                Faculty
              </Button>
              <Button onClick={() => handleQuickLogin(ROLES.STAFF)} variant="secondary" size="sm">
                Staff
              </Button>
              <Button onClick={() => handleQuickLogin(ROLES.INSTITUTION_NODAL)} variant="secondary" size="sm">
                Nodal Officer
              </Button>
              <div className="col-span-2">
                <Button onClick={() => handleQuickLogin(ROLES.AICTE_ADMIN)} variant="dark" size="sm" className="w-full">
                  AICTE Central Administrator
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          <Link to="/" className="text-slate-600 hover:text-slate-900 hover:underline">
            Back to Public Portal
          </Link>
          <span className="mx-2 text-slate-300">|</span>
          <Link to="/help" className="text-slate-600 hover:text-slate-900 hover:underline">
            Helpdesk and Policies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
