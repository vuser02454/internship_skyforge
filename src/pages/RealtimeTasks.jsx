import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';

// Main Page Component
export default function RealtimeTasks() {
  const { user } = useAuth();
  const { tasks, loading, error, acceptTask } = useTasks('open');

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
