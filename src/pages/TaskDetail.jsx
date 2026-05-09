import React, { useState, useRef } from 'react';

export default function TaskDetail() {
  // State for application
  const [pitch, setPitch] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  // State for PDF upload
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);

  // State for save for later
  const [isSaved, setIsSaved] = useState(false);

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

  return (
    <main className="pt-24 pb-stack-lg px-gutter max-w-container-max mx-auto">

<div className="flex flex-col lg:flex-row gap-gutter">
{/* Left Column: Task Details */}
<div className="flex-1 space-y-stack-lg">
<div className="bg-surface p-stack-lg rounded-xl task-card-shadow border border-outline-variant/30">
<div className="flex flex-wrap items-center gap-stack-sm mb-stack-md">
<span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-caps font-label-caps rounded-full">Available</span>
<span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-label-caps font-label-caps rounded-full">Web Development</span>
</div>
<h1 className="text-headline-lg font-headline-lg text-primary mb-stack-md">Optimize React Component Performance for E-commerce Dashboard</h1>
<div className="flex gap-gutter border-b border-outline-variant/30 pb-stack-lg mb-stack-lg">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary">schedule</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Deadline: 24h Left</span>
</div>
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary">location_on</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Remote</span>
</div>
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary">history</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Posted 2h ago</span>
</div>
</div>
<section className="space-y-stack-md">
<h2 className="text-headline-md font-headline-md text-on-surface">Detailed Job Description</h2>
<p className="text-body-md font-body-md text-on-surface-variant">
                            We are looking for a senior React developer to audit and optimize a high-traffic dashboard page. The current Lighthouse performance score for the dashboard is 62/100, primarily due to excessive re-rendering in the data table and chart components. 
                        </p>
<p className="text-body-md font-body-md text-on-surface-variant">
                            You will be tasked with identifying bottlenecks using React DevTools Profiler, implementing memoization where necessary, and optimizing the state management layer (Redux Toolkit) to ensure fluid user interactions.
                        </p>
</section>
<section className="mt-stack-lg space-y-stack-md">
<h2 className="text-headline-md font-headline-md text-on-surface">Requirements</h2>
<ul className="list-none space-y-stack-sm">
<li className="flex items-start gap-stack-sm text-body-md font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                Proven experience with React Profiler and performance tuning.
                            </li>
<li className="flex items-start gap-stack-sm text-body-md font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                Deep understanding of useMemo, useCallback, and React.memo patterns.
                            </li>
<li className="flex items-start gap-stack-sm text-body-md font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                Experience with large-scale Redux Toolkit implementations.
                            </li>
<li className="flex items-start gap-stack-sm text-body-md font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                Ability to deliver clean, documented code within a short timeframe.
                            </li>
</ul>
</section>
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
<p className="text-headline-lg font-budget-display text-primary">₹800</p>
</div>

{/* Application Box */}
<div className="space-y-stack-md mb-stack-lg">
<div id="tour-quick-apply" className="p-stack-md bg-surface-container-low rounded-lg border border-outline-variant/20">
  
  {hasApplied ? (
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
<div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant">
<img alt="Poster Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByKFfsUnq81WjriRvl6WMg_BFTRKBx1nipmdBdHvdHnz6RozOcTtoO6pAggtOOx-QpHpOERvjLLSkUC4k7TDa9Hxv8xheHMAa86C1e1pUvMHbX4FZ-2LLMttG_om2-gX5QtkrDfP2eGwdlshoWiX3JN9TpDouFioT8Ww2j6LGnemJ5KN6GbfxjqRrcLQPKzF5eOXnm5qZJ2ULye4STne5dP3lLCfMfsWrcU2qjwHIDoqEpM839nwD0eXlj3HafneWxKHlECgpNUQ"/>
</div>
<div>
<p className="text-body-md font-bold text-on-surface">Arjun P.</p>
<p className="text-body-sm text-on-surface-variant">Verified Enterprise</p>
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
  );
}
