import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">404: Page Not Found</h1>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested administrative resource or page address does not exist or has been relocated.
        </p>
        <Button onClick={() => navigate('/dashboard')} variant="primary" size="md" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
