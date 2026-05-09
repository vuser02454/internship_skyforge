import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

// Helper component for individual tasks
function TaskCard({ task, onAccept }) {
  const { user } = useAuth();
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  
  const isLongDescription = task.description && task.description.length > 120;

  const isOwner = user?.id === task.client_id;
  const isAccepted = task.status !== 'open';

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
    <div className={`bg-surface rounded-xl p-6 border transition-all flex flex-col ${
      accepted ? 'border-secondary shadow-md ring-1 ring-secondary/20' 
      : isAccepted ? 'border-outline-variant/20 opacity-60' 
      : 'border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/30'
    }`}>
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">work</span>
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full text-label-caps font-bold inline-block bg-secondary-container text-on-secondary-container">
              {task.status === 'open' ? 'Open' : 'Taken'}
            </span>
          </div>
        </div>
        <span className="text-[11px] text-on-surface-variant font-label-caps">
          {new Date(task.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Content */}
      <h3 className={`text-headline-md font-headline-md text-primary mb-2 ${showFullDetails ? '' : 'line-clamp-2'}`}>{task.title}</h3>
      <div className="flex-1 mb-4">
        <p className={`text-body-sm text-on-surface-variant ${showFullDetails ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
          {task.description}
        </p>
        {isLongDescription && (
          <button 
            onClick={() => setShowFullDetails(!showFullDetails)} 
            className="text-primary text-xs font-bold mt-2 hover:underline focus:outline-none flex items-center gap-1"
          >
            {showFullDetails ? 'Show Less' : 'Read Full Description'}
            <span className="material-symbols-outlined text-[14px]">
              {showFullDetails ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>
      
      {task.category && (
        <div className="mb-4">
          <span className="px-3 py-1 bg-surface-container rounded-full text-label-caps text-on-surface-variant border border-outline-variant">
            {task.category}
          </span>
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
        <div>
          <p className="text-label-caps text-on-surface-variant">Budget</p>
          <p className="text-budget-display font-budget-display text-primary">₹{task.budget}</p>
        </div>

        {accepted ? (
          <span className="flex items-center gap-1 px-4 py-2 bg-secondary text-on-secondary rounded-lg font-bold text-label-caps">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Accepted!
          </span>
        ) : isOwner ? (
          <span className="text-label-caps text-on-surface-variant italic">Your Task</span>
        ) : isAccepted ? (
          <span className="text-label-caps text-on-surface-variant">Taken</span>
        ) : (
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-label-caps hover:shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {accepting ? (
              <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Accepting...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">bolt</span> Accept Task</>
            )}
          </button>
        )}
      </div>
      
      {error && <div className="mt-3 text-error text-body-sm font-bold">{error}</div>}
    </div>
  );
}

// Main Page Component
export default function RealtimeTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setTasks(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();

    // Subscribe to real-time changes using postgres_changes
    const channel = supabase
      .channel('realtime-tasks-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          setTasks((prev) => {
            if (eventType === 'INSERT' && newRecord.status === 'open') {
              return [newRecord, ...prev];
            }
            if (eventType === 'UPDATE') {
              // If task is no longer open, instantly remove it from the feed
              if (newRecord.status !== 'open') {
                return prev.filter((t) => t.id !== newRecord.id);
              }
              // Otherwise update it
              return prev.map((t) => (t.id === newRecord.id ? newRecord : t));
            }
            if (eventType === 'DELETE') {
              return prev.filter((t) => t.id !== oldRecord.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchTasks]);

  const acceptTask = useCallback(async (taskId) => {
    if (!user) return { success: false, error: 'Must be logged in.' };

    // Optimistically update UI by instantly removing the task
    setTasks((prev) => prev.filter(t => t.id !== taskId));

    const { data, error: rpcError } = await supabase.rpc('accept_task', {
      task_id: taskId,
      freelancer: user.id,
    });

    if (rpcError || data === false) {
      // Failed to acquire atomic lock, another freelancer got it first
      await fetchTasks(); // Revert optimism
      return { success: false, error: 'Task already accepted by someone else!' };
    }
    return { success: true };
  }, [user, fetchTasks]);

  return (
    <main className="pt-24 lg:ml-64 px-gutter pb-12 min-h-screen max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">Live Task Feed</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Real-time feed of available tasks. Accept instantly before someone else does!
          </p>
        </div>
        <div id="tour-live-badge" className="flex items-center gap-2 px-4 py-2 bg-secondary-container/30 rounded-full border border-secondary/20">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-label-caps font-bold text-secondary">Live Updates Active</span>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl font-bold mb-6">
          Failed to load tasks: {error}
        </div>
      )}

      {!loading && !error && tasks.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 text-center shadow-sm border border-outline-variant/30">
          <span className="material-symbols-outlined text-[64px] text-surface-variant mb-4">search_off</span>
          <h2 className="text-headline-md font-headline-md text-on-surface mb-2">No open tasks right now</h2>
          <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
            Check back soon — new tasks are posted regularly and will appear here instantly!
          </p>
        </div>
      ) : (
        <div id="tour-live-feed" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onAccept={acceptTask} />
          ))}
        </div>
      )}
    </main>
  );
}
