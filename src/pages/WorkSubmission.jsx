import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Link, useSearchParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

export default function WorkSubmission() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlTaskId = searchParams.get('taskId');
  
  const { tasks, loading } = useTasks('my_engagements');
  // If a taskId is passed, find it; otherwise default to tasks[0]
  const task = urlTaskId ? tasks.find(t => t.id === urlTaskId) : tasks[0];

  const isClient = user?.user_metadata?.user_role === 'client';

  // Form state
  const [repoLink, setRepoLink] = useState(task?.submission_link || '');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [submitted, setSubmitted] = useState(!!task?.submission_link);

  // Renegotiation state
  const [isRenegotiating, setIsRenegotiating] = useState(false);
  const [newBudget, setNewBudget] = useState(task?.budget || '');
  const [newDeadline, setNewDeadline] = useState('');

  // Chat state
  const { messages, sendMessage } = useChat(task?.id);
  const [chatMessage, setChatMessage] = useState('');

  // Rating state
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);

  // Client actions state
  const [isApproving, setIsApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [revisionRequested, setRevisionRequested] = useState(false);

  // Payout details state (freelancer)
  const [hasPayout, setHasPayout] = useState(true); // optimistic default
  useEffect(() => {
    if (!user || isClient) return;
    supabase
      .from('payout_details')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setHasPayout(!!data));
  }, [user, isClient]);

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSavingDraft(false);
    alert('Draft saved successfully!');
  };

  // Submit Deliverables
  const handleSubmit = async () => {
    if (!repoLink) {
      alert('Please provide a GitHub Repository or live project link before submitting.');
      return;
    }
    setIsSubmitting(true);
    
    // Save to database
    const { error } = await supabase
      .from('tasks')
      .update({ 
        submission_link: repoLink,
        status: 'completed' // Or 'under_review' if you have that status
      })
      .eq('id', task.id);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert('Failed to submit deliverables. Make sure you added the submission_link column in Supabase!');
      return;
    }

    setSubmitted(true);

    // Add system message to chat
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sendMessage(`I've submitted the deliverables for this milestone. \nRepository: ${repoLink}`);
  };

  // Send chat message
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    await sendMessage(chatMessage);
    setChatMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true); // already loaded
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Approve (Mock Mode without Payment Gateway)
  const handleApprove = async () => {
    setIsApproving(true);

    try {
      // Simulate processing time
      await new Promise(r => setTimeout(r, 1500));

      // Directly update the task to completed in Supabase
      const { error } = await supabase
        .table('tasks')
        .update({ status: 'completed' })
        .eq('id', task.id);

      if (error) throw error;

      setApproved(true);
      sendMessage('SYSTEM NOTIFICATION: ✅ Payment approved (MOCK MODE)! Funds will be transferred to the freelancer\'s registered payout account.');

    } catch (error) {
      console.error(error);
      alert('Could not process approval: ' + error.message);
    } finally {
      setIsApproving(false);
    }
  };

  // Request Revision
  const handleRequestRevision = async () => {
    setRevisionRequested(true);
    await sendMessage("SYSTEM NOTIFICATION: The client has requested a revision on this submission. Please review their feedback in the chat and resubmit.");
    setSubmitted(false);
    setTimeout(() => setRevisionRequested(false), 3000);
  };

  const handleRenegotiate = async () => {
    if (!newBudget || !newDeadline) return alert("Please fill in both fields");
    await sendMessage(`SYSTEM NOTIFICATION: The Freelancer has proposed new terms for this revision: \n- New Budget: ₹${newBudget}\n- New Deadline: ${newDeadline}\n\nPlease discuss and agree in the chat.`);
    setIsRenegotiating(false);
  };

  if (loading) {
    return (
      <main className="lg:ml-64 pt-24 px-gutter pb-12 min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="lg:ml-64 pt-24 px-gutter pb-12 min-h-screen max-w-7xl mx-auto">
        <div className="bg-surface rounded-xl p-12 text-center shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[64px] text-surface-variant mb-4">work_off</span>
          <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2">No Active Tasks</h2>
          <p className="text-body-md text-on-surface-variant max-w-md mx-auto mb-6">You haven't accepted any tasks yet. Browse the live feed to find work!</p>
          <Link to="/realtime-tasks" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-label-caps hover:shadow-lg transition-all active:scale-95">Find Tasks</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="lg:ml-64 pt-24 px-gutter pb-12 max-w-container-max mx-auto">

{/* Header Section */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-lg mb-stack-lg">
<div>
<nav className="flex items-center gap-2 text-on-surface-variant text-body-sm font-body-sm mb-2">
<span>Active Tasks</span>
<span className="material-symbols-outlined text-sm">chevron_right</span>
<span className="text-primary font-semibold">{task.category || 'General'}</span>
</nav>
<h1 className="text-headline-lg font-headline-lg text-primary">{task.title}</h1>
<div className="flex items-center gap-4 mt-2">
<span className={`px-3 py-1 rounded-full text-label-caps font-label-caps flex items-center gap-1 ${
  approved ? 'bg-secondary-container text-on-secondary-container' : 
  submitted ? 'bg-primary-fixed text-on-primary-fixed' : 
  'bg-secondary-container text-on-secondary-container'
}`}>
<span className={`w-2 h-2 rounded-full ${approved ? 'bg-secondary' : submitted ? 'bg-primary' : 'bg-secondary'}`}></span>
  {approved ? 'Completed' : submitted ? 'Under Review' : 'In Progress'}
</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Deadline: Dec 24, 2024</span>
</div>
</div>
<div className="bg-surface ambient-shadow p-4 rounded-xl flex items-center gap-4 border border-outline-variant/30">
<div className="text-right">
<p className="text-label-caps font-label-caps text-on-surface-variant">Budget Total</p>
<p className="text-budget-display font-budget-display text-primary">₹{Number(task.budget).toLocaleString('en-IN')}</p>
</div>
<div className="h-10 w-px bg-outline-variant"></div>
<span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
</div>
</div>
{/* Split View Layout */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/* Left Column: Work Submission Area */}
<div className="lg:col-span-7 space-y-gutter">
{/* Payout Setup Banner — shown to freelancers who haven't set up their payout details */}
{!isClient && !hasPayout && (
  <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 mb-2">
    <span className="material-symbols-outlined text-amber-500 mt-0.5 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
    <div className="flex-1 min-w-0">
      <p className="text-label-caps font-label-caps text-amber-700 dark:text-amber-300 mb-0.5">Payout Details Missing</p>
      <p className="text-body-sm text-on-surface-variant">You haven't set up your bank or UPI details yet. Add them now so the client can release your funds when the project is approved.</p>
    </div>
    <Link to="/payout-setup" className="ml-2 flex-shrink-0 px-3 py-1.5 bg-amber-500 text-white rounded-lg font-bold text-[11px] hover:bg-amber-600 transition-colors whitespace-nowrap">
      Set Up Now
    </Link>
  </div>
)}
{/* Submission Card */}
<section className="bg-surface ambient-shadow rounded-xl p-stack-lg border border-outline-variant/20 overflow-hidden relative">
<div className={`absolute top-0 left-0 w-1 h-full transition-colors ${submitted ? 'bg-secondary' : 'bg-primary'}`}></div>
<div className="flex items-center justify-between mb-stack-md">
<h2 className="text-headline-md font-headline-md text-primary">Work Submission</h2>
<span className="text-label-caps font-label-caps text-on-surface-variant">
  {submitted ? '✓ Submitted' : 'Freelancer View'}
</span>
</div>
<div className="space-y-stack-lg">
{/* URL Submission */}
<div className="space-y-2">
<label className="text-label-caps font-label-caps text-on-surface-variant">GitHub Repository or Live Preview Link</label>
<div className="relative">
<input
  className="w-full bg-surface-container-lowest border border-outline rounded-lg py-3 px-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md outline-none disabled:opacity-50"
  placeholder="https://github.com/project-link"
  type="text"
  value={repoLink}
  onChange={(e) => setRepoLink(e.target.value)}
  disabled={submitted || isClient}
/>
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">link</span>
</div>
</div>
{/* Message for Poster */}
<div className="space-y-2">
<label className="text-label-caps font-label-caps text-on-surface-variant">Submission Notes</label>
<textarea
  className="w-full bg-surface-container-lowest border border-outline rounded-lg p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md outline-none disabled:opacity-50"
  placeholder="Briefly describe the deliverables included in this submission..."
  rows="4"
  value={submissionNotes}
  onChange={(e) => setSubmissionNotes(e.target.value)}
  disabled={submitted || isClient}
></textarea>
</div>
{!isClient && (
<div className="flex justify-end gap-3">
<button
  onClick={handleSaveDraft}
  disabled={isSavingDraft || submitted}
  className="px-6 py-3 border border-outline text-on-surface-variant font-bold text-label-caps font-label-caps rounded-lg hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSavingDraft ? 'Saving...' : submitted ? 'Draft Saved' : 'Save Draft'}
</button>
<button
  onClick={handleSubmit}
  disabled={isSubmitting || submitted}
  className={`px-8 py-3 font-bold text-label-caps font-label-caps rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
    submitted ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary hover:scale-[0.98]'
  }`}
>
  {isSubmitting ? (
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      Submitting...
    </span>
  ) : submitted ? '✓ Submitted' : 'Submit Deliverables'}
</button>
</div>
)}
</div>
</section>

{/* Freelancer Renegotiation UI */}
{!isClient && (
  <section className="bg-surface ambient-shadow rounded-xl p-stack-lg border border-outline-variant/20 mt-6">
    <div className="flex items-center justify-between">
      <h3 className="text-title-lg font-title-lg text-primary">Revision Options</h3>
      <button onClick={() => setIsRenegotiating(!isRenegotiating)} className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-label-caps hover:bg-secondary transition-colors hover:text-on-secondary">
        {isRenegotiating ? 'Cancel' : 'Request Extension / Budget'}
      </button>
    </div>
    
    {isRenegotiating && (
      <div className="space-y-4 pt-4 mt-4 border-t border-outline-variant/20">
        <p className="text-body-sm text-on-surface-variant">If the client requested extra work, you can propose a new budget and deadline here. The client will be notified in the chat.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">Proposed Budget (₹)</label>
            <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className="w-full bg-surface-container-lowest border border-outline rounded-lg py-2 px-4 outline-none focus:border-primary text-body-md" placeholder={task?.budget} />
          </div>
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">Proposed Deadline</label>
            <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="w-full bg-surface-container-lowest border border-outline rounded-lg py-2 px-4 outline-none focus:border-primary text-body-md" />
          </div>
        </div>
        <button onClick={handleRenegotiate} className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-label-caps hover:scale-[0.98] transition-transform">
          Submit Proposal to Client
        </button>
      </div>
    )}
  </section>
)}

{/* Poster Actions (Visible after submission) */}
{isClient && (
<section className={`bg-tertiary text-on-tertiary rounded-xl p-stack-lg shadow-xl border border-tertiary-container relative overflow-hidden transition-all mt-6 ${approved ? 'ring-2 ring-secondary' : ''}`}>
<div className="absolute -right-16 -bottom-16 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
<div className="flex items-center justify-between mb-stack-md relative z-10">
<div className="flex items-center gap-3">
<div className={`w-10 h-10 rounded-full flex items-center justify-center ${approved ? 'bg-secondary-fixed' : 'bg-secondary-container'}`}>
<span className={`material-symbols-outlined ${approved ? 'text-on-secondary-fixed' : 'text-on-secondary-container'}`}>
  {approved ? 'verified' : 'check_circle'}
</span>
</div>
<div>
<h3 className="text-headline-sm font-headline-sm">
  {approved ? 'Payment Released' : 'Client Verification'}
</h3>
<p className="text-body-sm font-body-sm text-tertiary-fixed-dim">
  {approved ? 'Funds transferred to freelancer' : 'Review submission and release funds'}
</p>
</div>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg mt-6 relative z-10">
<div className="bg-tertiary-container p-stack-md rounded-lg border border-outline-variant/10">
<p className="text-label-caps font-label-caps text-tertiary-fixed-dim mb-4">Rate Freelancer's Work</p>
<div className="flex items-center gap-1">
{[1, 2, 3, 4, 5].map((star) => (
  <button
    key={star}
    onClick={() => !approved && setRating(star)}
    onMouseEnter={() => !approved && setHoverRating(star)}
    onMouseLeave={() => setHoverRating(0)}
    disabled={approved}
    className="transition-transform hover:scale-110 disabled:cursor-default"
  >
    <span
      className={`material-symbols-outlined text-3xl cursor-pointer transition-colors ${
        (hoverRating || rating) >= star ? 'text-secondary-fixed' : 'text-tertiary-fixed-dim/50'
      }`}
      style={{ fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0" }}
    >star</span>
  </button>
))}
<span className="ml-2 text-body-lg font-bold text-secondary-fixed">{hoverRating || rating}.0</span>
</div>
</div>
<div className="flex flex-col justify-center gap-3">
<button
  onClick={handleApprove}
  disabled={isApproving || approved}
  className={`w-full py-4 font-extrabold text-label-caps font-label-caps rounded-lg shadow-lg transition-all disabled:cursor-not-allowed ${
    approved
      ? 'bg-secondary text-on-secondary'
      : 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim'
  }`}
>
  {isApproving ? (
    <span className="flex items-center justify-center gap-2">
      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      Processing...
    </span>
  ) : approved ? '✓ Payment Released' : `Approve & Pay ₹${Number(task.budget).toLocaleString('en-IN')}`}
</button>
<button
  onClick={handleRequestRevision}
  disabled={approved || revisionRequested}
  className="w-full py-2 text-error-container font-bold text-label-caps font-label-caps hover:underline decoration-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
>
  {revisionRequested ? 'Revision Requested ✓' : 'Request Revision'}
</button>
</div>
</div>
</section>
)}
</div>
{/* Right Column: Chat/Communication */}
<div className="lg:col-span-5 h-[calc(100vh-200px)] flex flex-col">
<section id="tour-chat" className="bg-surface ambient-shadow rounded-xl border border-outline-variant/20 flex flex-col h-full overflow-hidden">
{/* Chat Header */}
<div className="px-6 py-4 border-b border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="relative">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg border border-outline-variant">
  {user?.user_metadata?.user_role === 'client' 
    ? (task.freelancer?.full_name?.charAt(0)?.toUpperCase() || task.freelancer?.email?.charAt(0)?.toUpperCase() || 'F')
    : (task.client?.full_name?.charAt(0)?.toUpperCase() || task.client?.email?.charAt(0)?.toUpperCase() || 'C')}
</div>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface rounded-full"></span>
</div>
<div>
<p className="text-body-md font-body-md font-bold text-primary">
  {user?.user_metadata?.user_role === 'client' 
    ? (task.freelancer?.full_name || task.freelancer?.email || 'Freelancer')
    : (task.client?.full_name || task.client?.email || 'Client')}
</p>
<p className="text-[11px] font-label-caps text-on-surface-variant flex items-center gap-1">
<span className="w-1 h-1 rounded-full bg-secondary"></span>
  {user?.user_metadata?.user_role === 'client' ? 'Freelancer' : 'Project Poster'} • Active Now
</p>
</div>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
{/* Chat Messages */}
<div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(#e0e3e5_1px,transparent_1px)] [background-size:20px_20px]">
{messages.length === 0 && (
  <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/50">
    <span className="material-symbols-outlined text-[48px] mb-2">forum</span>
    <p className="text-body-sm">No messages yet. Say hello!</p>
  </div>
)}
{messages.map((msg) => {
  const isOutgoing = msg.sender_id === user?.id;
  const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const senderInitials = msg.sender?.full_name?.charAt(0)?.toUpperCase() || msg.sender?.email?.charAt(0)?.toUpperCase() || 'U';

  if (!isOutgoing) {
    return (
      <div key={msg.id} className="flex gap-3 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container font-bold text-sm mt-1">{senderInitials}</div>
        <div className="flex flex-col items-start gap-1 max-w-[calc(100%-40px)]">
          <div className="bg-surface-container-low text-on-surface px-4 py-2.5 rounded-2xl rounded-tl-none border border-outline-variant/10 shadow-sm w-fit break-words">
            <p className="text-body-sm font-body-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
          </div>
          <p className="text-[10px] font-label-caps text-on-surface-variant">{timeStr}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div key={msg.id} className={`flex flex-row-reverse gap-3 max-w-[85%] ml-auto ${msg.isOptimistic ? 'opacity-70' : ''}`}>
        <div className="flex flex-col items-end gap-1 max-w-[100%]">
          <div className="bg-primary text-on-primary px-4 py-2.5 rounded-2xl rounded-tr-none shadow-md w-fit break-words">
            <p className="text-body-sm font-body-sm leading-relaxed whitespace-pre-wrap break-words text-left">{msg.message}</p>
          </div>
          <p className="text-[10px] font-label-caps text-on-surface-variant flex items-center justify-end gap-1">
            {timeStr}
            {msg.isOptimistic && <span className="material-symbols-outlined text-[10px] animate-pulse">sync</span>}
          </p>
        </div>
      </div>
    );
  }
})}
</div>
{/* Chat Input */}
<div className="p-4 bg-surface-container-lowest border-t border-outline-variant/30">
<div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-outline focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">add_circle</span>
</button>
<input
  className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-body-sm font-body-sm"
  placeholder="Type a message..."
  type="text"
  value={chatMessage}
  onChange={(e) => setChatMessage(e.target.value)}
  onKeyDown={handleKeyDown}
/>
<button
  onClick={handleSendMessage}
  disabled={!chatMessage.trim()}
  className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center hover:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
</button>
</div>
</div>
</section>
</div>
</div>

</main>
  );
}
