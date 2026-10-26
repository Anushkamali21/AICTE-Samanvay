import React from 'react';
import { CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const STAGES = [
  { key: 'SUBMITTED', title: 'Complaint Submitted', matchStatus: ['Submitted'] },
  { key: 'ACKNOWLEDGED', title: 'Complaint Acknowledged', matchStatus: ['Acknowledged'] },
  { key: 'ASSIGNED', title: 'Assigned to Authorized Officer', matchStatus: ['Assigned to Officer'] },
  { key: 'REVIEW', title: 'Review Initiated', matchStatus: ['Under Review'] },
  { key: 'RESPONSE', title: 'Institution Response Received', matchStatus: ['In Progress', 'Awaiting Institution Response'] },
  { key: 'RESOLUTION_PROPOSED', title: 'Resolution Proposed', matchStatus: ['In Progress'] },
  { key: 'RESOLVED', title: 'Resolution Issued', matchStatus: ['Resolved'] },
  { key: 'CLOSED', title: 'Complaint Closed', matchStatus: ['Closed'] }
];

export const StatusTimeline = ({ history = [], currentStatus }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((event, eventIdx) => {
          const isLast = eventIdx === history.length - 1;
          const isEscalated = event.newStatus === 'Escalated';
          const isResolved = event.newStatus === 'Resolved';

          return (
            <li key={event._id || eventIdx}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3 items-start">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                        isEscalated
                          ? 'bg-red-700 text-white'
                          : isResolved
                          ? 'bg-emerald-700 text-white'
                          : 'bg-blue-700 text-white'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isEscalated ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CircleDot className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {event.action}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-medium border border-slate-200">
                          {event.newStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {event.userVisibleExplanation}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        By {event.actorName} ({event.actorRole})
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-slate-500 flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <time dateTime={event.timestamp}>
                        {formatDateTime(event.timestamp)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StatusTimeline;
