import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';

export default function MyProjects() {
  const { tasks, loading, error } = useTasks('my_posted');

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <main className="flex-1 lg:ml-64 pt-24 pb-12 px-gutter min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-headline-lg font-headline-lg text-primary mb-2">My Projects</h1>
          <p className="text-body-md text-on-surface-variant">Track your posted projects.</p>
        </header>

        {loading && (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        )}
        
        {!loading && sortedTasks.length === 0 ? (
          <div className="bg-surface rounded-xl p-12 text-center shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[64px] text-surface-variant mb-4">work_history</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2">No active projects yet</h2>
            <p className="text-body-md text-on-surface-variant max-w-md mx-auto mb-6">You haven't posted any projects recently.</p>
            <Link to="/post-task" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-label-caps hover:shadow-lg transition-all active:scale-95">Post a Task</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onAccept={() => {}} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
