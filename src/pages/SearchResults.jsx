import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';

export default function SearchResults() {
  const [filter, setFilter] = useState('open');
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, loading, error, acceptTask, refetch } = useTasks(filter);

  // Client-side search filter
  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      task.title?.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q) ||
      task.category?.toLowerCase().includes(q)
    );
  });

  const filterOptions = [
    { key: 'open', label: 'Open Tasks', icon: 'radio_button_unchecked' },
    { key: 'my_tasks', label: 'My Accepted', icon: 'assignment_ind' },
    { key: 'my_posted', label: 'My Posted', icon: 'post_add' },
  ];

  return (
    <main className="pt-24 lg:ml-64 px-gutter pb-12 min-h-screen max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-label-caps text-on-surface-variant mb-2">
            <span>Marketplace</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary font-bold">Live Tasks</span>
          </nav>
          <h1 className="text-headline-lg font-headline-lg text-primary">Live Tasks</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Real-time feed of available tasks. Accept instantly before someone else does!
          </p>
        </div>

        {/* Real-time indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container/30 rounded-full border border-secondary/20">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-label-caps font-bold text-secondary">Live Updates</span>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Filter buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-label-caps font-bold whitespace-nowrap transition-all ${
                filter === opt.key
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-full text-body-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
          <p className="text-body-md text-on-surface-variant">Loading tasks...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 bg-error-container text-on-error-container rounded-xl border border-error/20 flex items-start gap-3 mb-6">
          <span className="material-symbols-outlined text-error">error</span>
          <div>
            <p className="font-bold">Failed to load tasks</p>
            <p className="text-body-sm mt-1">{error}</p>
            <button onClick={refetch} className="mt-3 px-4 py-2 bg-error text-on-error rounded-lg text-label-caps font-bold hover:opacity-90 transition-opacity">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Task Grid */}
      {!loading && !error && (
        <>
          {filteredTasks.length === 0 ? (
            <div className="bg-surface rounded-xl p-12 text-center shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-surface-variant mb-4">
                {filter === 'open' ? 'search_off' : 'assignment'}
              </span>
              <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
                {searchQuery ? 'No matching tasks' : filter === 'open' ? 'No open tasks right now' : 'No tasks found'}
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                {searchQuery
                  ? `No tasks match "${searchQuery}". Try a different search term.`
                  : filter === 'open'
                  ? 'Check back soon — new tasks are posted regularly!'
                  : 'Tasks you accept or post will appear here.'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-label-caps text-on-surface-variant mb-4">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onAccept={acceptTask} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
