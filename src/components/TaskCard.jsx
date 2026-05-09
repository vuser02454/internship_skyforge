import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CATEGORY_ICONS = {
  'UI/UX Design': 'palette',
  'Web Development': 'code',
  'Content Writing': 'edit_note',
  'Data Entry': 'table_chart',
  'General': 'task_alt',
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getDeadlineInfo(deadline) {
  if (!deadline) return null;
  // Handle edge cases where timezone might push date back a day
  const date = new Date(deadline);
  const now = new Date();
  
  // Set times to midnight to calculate purely based on days
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const diffMonths = diffDays / 30.44;

  let colorClass = '';
  let indicatorColor = '';
  let text = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  let meterWidth = '100%';

  if (diffMonths >= 2) {
    colorClass = 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
    indicatorColor = 'bg-[#10b981]';
    meterWidth = '100%';
  } else if (diffMonths >= 1) {
    colorClass = 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
    indicatorColor = 'bg-[#f59e0b]';
    meterWidth = '66%';
  } else if (diffDays >= 0) {
    colorClass = 'bg-error-container text-error border-error/30';
    indicatorColor = 'bg-error';
    meterWidth = '33%';
  } else {
    colorClass = 'bg-error text-on-error border-error';
    indicatorColor = 'bg-on-error';
    text = 'Overdue';
    meterWidth = '0%';
  }

  return { colorClass, indicatorColor, text, meterWidth };
}

export default function TaskCard({ task, onAccept }) {
  const { user } = useAuth();
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);

  const isOwner = user?.id === task.client_id;
  const isClientRole = user?.user_metadata?.user_role === 'client';
  const isAccepted = task.status !== 'open';
  const icon = CATEGORY_ICONS[task.category] || CATEGORY_ICONS['General'];
  const deadlineInfo = getDeadlineInfo(task.deadline);

  const handleAccept = async () => {
    setError('');
    setAccepting(true);

    const result = await onAccept(task.id);

    if (result.success) {
      setAccepted(true);
    } else {
      setError(result.error);
    }
    setAccepting(false);
  };

  return (
    <div
      className={`bg-surface rounded-xl p-6 border transition-all flex flex-col ${
        accepted
          ? 'border-secondary shadow-md ring-1 ring-secondary/20'
          : isAccepted
          ? 'border-outline-variant/20 opacity-60'
          : 'border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/30'
      }`}
    >
      {/* Top Row: Category + Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">{icon}</span>
          </div>
          <div>
            <span className={`px-2 py-0.5 rounded-full text-label-caps font-bold inline-block ${
              task.status === 'open'
                ? 'bg-secondary-container text-on-secondary-container'
                : task.status === 'in_progress'
                ? 'bg-primary-fixed text-on-primary-fixed'
                : task.status === 'completed'
                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                : 'bg-surface-container text-on-surface-variant'
            }`}>
              {task.status === 'open' ? 'Open' :
               task.status === 'in_progress' ? 'In Progress' :
               task.status === 'completed' ? 'Completed' :
               'Cancelled'}
            </span>
          </div>
        </div>
        <span className="text-[11px] text-on-surface-variant font-label-caps">
          {timeAgo(task.created_at)}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-headline-md font-headline-md text-primary mb-2 line-clamp-2">{task.title}</h3>
      <p className="text-body-sm text-on-surface-variant flex-1 line-clamp-3 mb-4">{task.description}</p>

      {/* Client info */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[11px] font-bold">
          {task.client?.full_name?.charAt(0)?.toUpperCase() || task.client?.email?.charAt(0)?.toUpperCase() || 'C'}
        </div>
        <span className="text-body-sm text-on-surface-variant">
          {task.client?.full_name || task.client?.email || 'Anonymous Client'}
        </span>
      </div>

      {/* Category tag & Deadline Meter */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        {task.category && (
          <span className="px-3 py-1 bg-surface-container rounded-full text-label-caps text-on-surface-variant border border-outline-variant">
            {task.category}
          </span>
        )}
        
        {deadlineInfo && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${deadlineInfo.colorClass}`}>
            <span className="material-symbols-outlined text-[14px]">calendar_clock</span>
            <span className="text-[11px] font-bold tracking-wider uppercase">{deadlineInfo.text}</span>
            <div className="w-8 h-1.5 bg-black/10 rounded-full overflow-hidden ml-1">
              <div 
                className={`h-full ${deadlineInfo.indicatorColor} transition-all duration-500`} 
                style={{ width: deadlineInfo.meterWidth }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: Budget + Accept */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
        <div>
          <p className="text-label-caps text-on-surface-variant">Budget</p>
          <p className="text-budget-display font-budget-display text-primary">₹{Number(task.budget).toLocaleString('en-IN')}</p>
        </div>

        {/* Accept Button Logic */}
        {accepted ? (
          <span className="flex items-center gap-1 px-4 py-2 bg-secondary text-on-secondary rounded-lg font-bold text-label-caps">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Accepted!
          </span>
        ) : isOwner ? (
          <span className="text-label-caps text-on-surface-variant italic">Your Task</span>
        ) : isClientRole ? (
          <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Client View
          </span>
        ) : isAccepted ? (
          <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Taken
          </span>
        ) : (
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-label-caps hover:shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {accepting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Accepting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Accept Task
              </>
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-error-container text-on-error-container rounded-lg text-body-sm flex items-start gap-2">
          <span className="material-symbols-outlined text-error text-[18px] mt-0.5">warning</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
