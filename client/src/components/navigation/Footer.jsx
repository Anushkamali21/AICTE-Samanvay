import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium text-slate-700">
            AICTE SAMANVAY: Integrated Complaint Management and Tracking Portal
          </p>
          <p className="mt-0.5 text-slate-500">
            Technical Education Grievance Redressal Initiative. Demonstration Environment.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/help" className="hover:text-blue-700 transition-colors">Help & FAQ</Link>
          <a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" className="hover:text-blue-700 transition-colors">
            Official AICTE Portal
          </a>
          <span className="text-slate-400">Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
