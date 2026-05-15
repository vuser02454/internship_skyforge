import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Update state
  const [updates, setUpdates] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // State for application
  const [pitch, setPitch] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  // State for PDF upload
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);

  // State for save for later
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchTaskAndUpdates = async () => {
      setLoading(true);
      // Fetch task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*, client:profiles!tasks_client_id_fkey(full_name, email, avatar_url)')
        .eq('id', id)
        .single();
        
      if (taskError) {
        console.error('Error fetching task:', taskError);
        setError('Task not found.');
      } else {
        setTask(taskData);
        setUpdateForm({
          title: taskData.title || '',
          description: taskData.description || '',
          budget: taskData.budget || '',
          deadline: taskData.deadline || '',
          category: taskData.category || '',
          status: taskData.status || 'open',
          attachment_url: taskData.attachment_url || ''
        });
      }

      // Fetch updates
      const { data: updateData } = await supabase
        .from('task_updates')
        .select('*')
        .eq('task_id', id)
        .order('created_at', { ascending: false });
        
      if (updateData) setUpdates(updateData);
      
      setLoading(false);
    };
    
    fetchTaskAndUpdates();

    // Realtime subscriptions
    const taskSub = supabase.channel(`public:tasks:id=eq.${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks', filter: `id=eq.${id}` }, (payload) => {
        setTask(prev => ({ ...prev, ...payload.new }));
      }).subscribe();

    const updatesSub = supabase.channel(`public:task_updates:task_id=eq.${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_updates', filter: `task_id=eq.${id}` }, (payload) => {
        setUpdates(prev => [payload.new, ...prev]);
      }).subscribe();

    return () => {
      supabase.removeChannel(taskSub);
      supabase.removeChannel(updatesSub);
    };
  }, [id]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: value }));
  };

  const submitTaskUpdate = async () => {
    setIsUpdating(true);
    try {
      const changes = [];
      const updatedFields = {};

      // Check what changed
      Object.keys(updateForm).forEach(key => {
        if (updateForm[key] !== task[key] && !(updateForm[key] === '' && !task[key])) {
          updatedFields[key] = updateForm[key];
          changes.push({
            task_id: id,
            updated_by: user.id,
            field_changed: key,
            old_value: String(task[key] || ''),
            new_value: String(updateForm[key] || '')
          });
        }
      });

      if (changes.length === 0) {
        setIsUpdateModalOpen(false);
        setIsUpdating(false);
        return;
      }

      // Update task
      const { error: taskUpdateError } = await supabase
        .from('tasks')
        .update(updatedFields)
        .eq('id', id);

      if (taskUpdateError) throw taskUpdateError;

      // Insert updates history
      const { error: historyError } = await supabase
        .from('task_updates')
        .insert(changes);

      if (historyError) throw historyError;

      // Optimistic UI update handled by realtime subscription
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update task: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else if (file) {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleApply = () => {
    if (!pitch.trim() && !pdfFile) {
      alert("Please provide a short pitch or upload your PDF resume.");
      return;
    }
    setIsApplying(true);
    
    // Simulate API call to submit application
    setTimeout(() => {
      setIsApplying(false);
      setHasApplied(true);
    }, 1500);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <main className="pt-24 pb-stack-lg px-gutter max-w-container-max mx-auto min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="pt-24 pb-stack-lg px-gutter max-w-container-max mx-auto min-h-screen flex items-center justify-center flex-col">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <h2 className="text-headline-md font-bold text-on-surface mb-2">{error || "Task not found"}</h2>
        <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">Go Back</button>
      </main>
    );
  }

  const isOwner = user?.id === task.client_id;
  const isClientRole = user?.user_metadata?.user_role === 'client';

  return (
    <>
    <main className="pt-24 pb-stack-lg px-gutter max-w-container-max mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary font-bold hover:underline">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Tasks
        </button>
        
        {isOwner && task.status === 'open' && (
          <button 
            onClick={() => setIsUpdateModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-4 py-3 sm:py-2 rounded-lg font-bold text-label-caps shadow-sm hover:scale-[1.02] sm:hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Update Task
          </button>
        )}
      </div>

<div className="flex flex-col lg:flex-row gap-gutter">
{/* Left Column: Task Details */}
<div className="flex-1 space-y-stack-lg">
<div className="bg-surface p-stack-lg rounded-xl task-card-shadow border border-outline-variant/30">
<div className="flex flex-wrap items-center gap-stack-sm mb-stack-md">
<span className={`px-3 py-1 text-label-caps font-label-caps rounded-full ${
  task.status === 'open' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'
}`}>
  {task.status === 'open' ? 'Open' : 'Unavailable'}
</span>
{task.category && (
  <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-label-caps font-label-caps rounded-full">
    {task.category}
  </span>
)}
</div>
<h1 className="text-headline-lg font-headline-lg text-primary mb-stack-md">{task.title}</h1>
<div className="flex flex-wrap gap-gutter border-b border-outline-variant/30 pb-stack-lg mb-stack-lg">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary">schedule</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Flexible'}</span>
</div>
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary">history</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Posted {timeAgo(task.created_at)}</span>
</div>
</div>
<section className="space-y-stack-md">
<h2 className="text-headline-md font-headline-md text-on-surface">Detailed Job Description</h2>
<p className="text-body-md font-body-md text-on-surface-variant whitespace-pre-wrap">
{task.description}
</p>

{task.attachment_url && (
  <div className="mt-6 pt-6 border-t border-outline-variant/30">
    <h3 className="text-headline-sm font-bold text-on-surface mb-4">Project Attachment</h3>
    <a 
      href={task.attachment_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 p-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
        <span className="material-symbols-outlined">attach_file</span>
      </div>
      <div>
        <p className="text-body-sm font-bold text-on-surface group-hover:text-primary transition-colors">View Attachment</p>
        <p className="text-label-caps text-on-surface-variant">External Link</p>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant ml-2 group-hover:text-primary transition-colors">open_in_new</span>
    </a>
  </div>
)}
</section>

{/* Update History Timeline */}
{updates.length > 0 && (
  <section className="mt-8 pt-8 border-t border-outline-variant/30">
    <h3 className="text-title-lg font-title-lg text-on-surface mb-6 flex items-center gap-2">
      <span className="material-symbols-outlined text-primary">update</span>
      Update History
    </h3>
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
      {updates.map((update, idx) => (
        <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary-container text-on-primary-container shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
            <span className="material-symbols-outlined text-[16px]">{update.field_changed === 'budget' ? 'payments' : update.field_changed === 'deadline' ? 'event' : 'edit_note'}</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-label-caps font-bold text-primary capitalize">{update.field_changed} updated</span>
              <span className="text-[10px] text-on-surface-variant">{timeAgo(update.created_at)}</span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              Changed from <span className="line-through opacity-70">{update.old_value || 'None'}</span> to <strong className="text-on-surface">{update.new_value || 'None'}</strong>
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

</div>

{/* Internal PDF Reader Simulation (if they uploaded a PDF) */}
{pdfFile && (
  <div className="bg-surface p-stack-lg rounded-xl task-card-shadow border border-outline-variant/30 mt-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-headline-sm font-headline-sm text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-error">picture_as_pdf</span>
        Attached Resume / Portfolio
      </h2>
      <button onClick={() => setPdfFile(null)} className="text-on-surface-variant hover:text-error text-sm">Remove</button>
    </div>
    <div className="bg-surface-container-low rounded-lg p-12 border border-outline-variant/20 flex flex-col items-center justify-center text-center">
      <span className="material-symbols-outlined text-[48px] text-primary/50 mb-3">description</span>
      <p className="text-body-md font-bold text-on-surface">{pdfFile.name}</p>
      <p className="text-body-sm text-on-surface-variant mb-4">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
      <p className="text-label-caps text-secondary-fixed italic">Ready to be sent with your application.</p>
    </div>
  </div>
)}

</div>
{/* Right Column: Sidebar */}
<aside className="lg:w-80 space-y-stack-lg">
{/* Budget Card */}
<div className="bg-surface p-stack-lg rounded-xl task-card-shadow border border-outline-variant/30 sticky top-24">
<div className="mb-stack-md">
<p className="text-label-caps font-label-caps text-on-surface-variant mb-1">TASK BUDGET</p>
<p className="text-headline-lg font-budget-display text-primary">₹{Number(task.budget).toLocaleString('en-IN')}</p>
</div>

{/* Application Box */}
<div className="space-y-stack-md mb-stack-lg">
<div id="tour-quick-apply" className="p-stack-md bg-surface-container-low rounded-lg border border-outline-variant/20">
  
  {isOwner ? (
    <div className="text-center py-4">
      <span className="material-symbols-outlined text-primary text-3xl mb-2">stars</span>
      <h3 className="font-bold text-primary">Your Task</h3>
      <p className="text-body-sm text-on-surface-variant">You posted this task. Check dashboard for applicants.</p>
    </div>
  ) : isClientRole ? (
    <div className="text-center py-4">
      <span className="material-symbols-outlined text-primary text-3xl mb-2">visibility</span>
      <h3 className="font-bold text-primary">Client View</h3>
      <p className="text-body-sm text-on-surface-variant">You are viewing this as a client.</p>
    </div>
  ) : task.status !== 'open' ? (
    <div className="text-center py-4">
      <span className="material-symbols-outlined text-on-surface-variant text-3xl mb-2">lock</span>
      <h3 className="font-bold text-on-surface-variant">Not Available</h3>
      <p className="text-body-sm text-on-surface-variant">This task has already been assigned.</p>
    </div>
  ) : hasApplied ? (
    <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-secondary text-3xl">check_circle</span>
      </div>
      <h3 className="font-bold text-primary mb-1">Application Sent!</h3>
      <p className="text-body-sm text-on-surface-variant">The client will review your pitch and PDF.</p>
    </div>
  ) : (
    <>
      <p className="text-label-caps font-label-caps text-on-surface-variant mb-2">QUICK APPLY</p>
      <textarea 
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
        className="w-full bg-white border border-outline rounded-lg p-2 text-body-sm font-body-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[100px] resize-none transition-all" 
        placeholder="Why are you a good fit for this task? (Short pitch)"
      ></textarea>
      
      {/* PDF Upload Button */}
      <input 
        type="file" 
        accept="application/pdf"
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button 
        onClick={() => fileInputRef.current.click()}
        className={`w-full mt-2 flex items-center justify-center gap-2 py-2 border rounded-lg text-body-sm font-bold transition-colors ${
          pdfFile 
            ? 'border-secondary text-secondary bg-secondary/5' 
            : 'border-outline-variant text-on-surface-variant hover:bg-white'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {pdfFile ? 'check_circle' : 'upload_file'}
        </span>
        {pdfFile ? 'PDF Attached' : 'Attach PDF Resume'}
      </button>

      <button 
        onClick={handleApply}
        disabled={isApplying}
        className="w-full mt-3 bg-primary text-on-primary font-bold py-3 rounded-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
      >
        {isApplying ? (
          <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Sending...</>
        ) : (
          'Send Application'
        )}
      </button>
    </>
  )}
</div>
</div>

{/* Poster Profile */}
<div className="pt-stack-md border-t border-outline-variant/30">
<p className="text-label-caps font-label-caps text-on-surface-variant mb-stack-md">POSTED BY</p>
<div className="flex items-center gap-stack-md mb-stack-sm">
<div className="w-12 h-12 rounded-full overflow-hidden bg-primary-container text-on-primary-container font-bold flex items-center justify-center">
  {task.client?.avatar_url ? (
    <img alt="Poster Profile" src={task.client.avatar_url} className="w-full h-full object-cover" />
  ) : (
    (task.client?.full_name?.charAt(0) || task.client?.email?.charAt(0) || 'C').toUpperCase()
  )}
</div>
<div>
<p className="text-body-md font-bold text-on-surface">{task.client?.full_name || 'Anonymous Client'}</p>
<p className="text-body-sm text-on-surface-variant">Verified Client</p>
</div>
</div>
<div className="flex items-center gap-stack-sm mt-3">
<span className="material-symbols-outlined text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
<span className="text-body-sm font-bold text-secondary">4.9 / 5.0 Trust Rating</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-2">142 Tasks Completed • 98% On-time Payment</p>
</div>
<button id="tour-save-later"
  onClick={toggleSave}
  className={`w-full mt-stack-lg border font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
    isSaved 
      ? 'border-secondary text-secondary bg-secondary/5' 
      : 'border-outline text-on-surface-variant hover:bg-surface-container'
  }`}
>
  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
  {isSaved ? 'Saved for Later' : 'Save for Later'}
</button>
</div>
</aside>
</div>

</main>

{/* Update Task Modal */}
{isUpdateModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-surface w-full max-w-2xl sm:rounded-2xl rounded-t-3xl shadow-2xl border-t sm:border border-outline-variant/30 flex flex-col max-h-[90vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-300">
      <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
        <h2 className="text-headline-sm font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">edit_square</span>
          Update Task Conditions
        </h2>
        <button onClick={() => setIsUpdateModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-label-caps text-on-surface-variant">Project Title</label>
          <input name="title" value={updateForm.title} onChange={handleUpdateChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">Budget (₹)</label>
            <input name="budget" type="number" value={updateForm.budget} onChange={handleUpdateChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">Deadline</label>
            <input name="deadline" type="date" value={updateForm.deadline} onChange={handleUpdateChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">Category</label>
            <select name="category" value={updateForm.category} onChange={handleUpdateChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary outline-none">
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Data Entry">Data Entry</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">Status</label>
            <select name="status" value={updateForm.status} onChange={handleUpdateChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary outline-none">
              <option value="open">Open</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-label-caps text-on-surface-variant">Detailed Description & Requirements</label>
          <textarea name="description" value={updateForm.description} onChange={handleUpdateChange} rows="5" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 text-body-md focus:border-primary outline-none resize-none"></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-label-caps text-on-surface-variant">Attachment Link (Optional)</label>
          <input name="attachment_url" type="url" placeholder="https://..." value={updateForm.attachment_url} onChange={handleUpdateChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
        </div>
      </div>

      <div className="p-4 sm:p-6 border-t border-outline-variant/20 bg-surface-container-lowest flex flex-col sm:flex-row justify-end gap-3 sm:rounded-b-2xl">
        <button onClick={() => setIsUpdateModalOpen(false)} className="w-full sm:w-auto px-6 py-3 sm:py-2.5 font-bold text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors order-2 sm:order-1">Cancel</button>
        <button onClick={submitTaskUpdate} disabled={isUpdating} className="w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-primary text-on-primary font-bold rounded-lg shadow-md hover:scale-[1.02] sm:hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2">
          {isUpdating ? <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Saving...</> : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}
