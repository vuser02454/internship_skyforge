import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function PostTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('UI/UX Design');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(500);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleGenerateAI = () => {
    if (!title) {
      setError("Please enter a Task Title first so the AI knows what to write!");
      return;
    }
    setError(null);
    setGenerating(true);
    // Simulated AI generation delay
    setTimeout(() => {
      const templates = {
        'UI/UX Design': `We are looking for an experienced UI/UX designer to help us with ${title}. \n\nKey Deliverables:\n- Wireframes and high-fidelity mockups\n- Interactive prototypes\n- Design system assets\n\nRequirements:\n- Proven track record in designing user-centric interfaces\n- Proficiency in Figma\n- Strong understanding of modern design principles.`,
        'Web Development': `We are seeking a skilled Web Developer to build ${title}. \n\nKey Deliverables:\n- Clean, efficient, and well-documented code\n- Responsive and mobile-friendly layout\n- Integration with our existing backend APIs\n\nRequirements:\n- Strong experience with modern JavaScript frameworks\n- Familiarity with Tailwind CSS\n- Good communication skills.`,
        'Software Development': `We need a software engineer for ${title}. \n\nKey Deliverables:\n- Robust backend/frontend architecture\n- Scalable code deployment\n\nRequirements:\n- Strong algorithmic and system design skills\n- Problem-solving mindset.`,
        'Content Writing': `We are looking for a talented writer for ${title}. \n\nKey Deliverables:\n- Engaging, SEO-optimized content\n- Plagiarism-free and well-researched material\n\nRequirements:\n- Exceptional grammar and writing skills\n- Experience in our specific niche.`,
        'Graphic Design': `We need a creative Graphic Designer to help with ${title}. \n\nKey Deliverables:\n- High-resolution visual assets\n- Source files (AI/PSD)\n\nRequirements:\n- Expert in Adobe Creative Suite\n- Strong creative portfolio.`,
        'Video Editing': `We are looking for a Video Editor for ${title}. \n\nKey Deliverables:\n- High-quality, engaging video edits\n- Color grading and audio syncing\n\nRequirements:\n- Proficiency in Premiere Pro or Final Cut\n- Strong storytelling skills.`,
        'Digital Marketing': `We need a marketing expert to handle ${title}. \n\nKey Deliverables:\n- Comprehensive marketing strategy\n- Campaign setup and tracking\n\nRequirements:\n- Proven ROI in past campaigns\n- Expertise in Ads and analytics.`,
      };
      const defaultTemplate = `We are looking for a professional freelancer to help us with ${title}. \n\nKey Deliverables:\n- High quality output delivered on time\n- Regular progress updates\n\nRequirements:\n- Proven experience in this specific field\n- Excellent communication skills\n- Portfolio of past work.`;
      
      setDescription(templates[category] || defaultTemplate);
      setGenerating(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !budget) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError("You must be logged in to post a task.");
      setLoading(false);
      return;
    }

    // Handle Attachment Upload
    let attachmentUrl = null;
    if (attachment) {
      const fileExt = attachment.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('task_attachments')
        .upload(filePath, attachment);

      if (uploadError) {
        setError("Failed to upload attachment: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('task_attachments')
        .getPublicUrl(filePath);
        
      attachmentUrl = publicUrl;
    }

    // Insert into Supabase tasks table
    const { error: dbError } = await supabase
      .from('tasks')
      .insert([
        { 
          client_id: user.id, 
          title, 
          description, 
          budget: Number(budget), 
          status: 'open', 
          category, 
          deadline: deadline || null,
          attachment_url: attachmentUrl 
        }
      ]);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <main className="flex-grow pt-24 pb-16 px-4 md:px-gutter max-w-4xl mx-auto w-full">

{/* Stepper Progress Bar */}
<div className="mb-10">
<div className="relative flex justify-between items-center max-w-lg mx-auto">
<div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-variant -translate-y-1/2 z-0"></div>
<div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-primary -translate-y-1/2 z-0"></div>
{/* Step 1: Active */}
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold active-dot">1</div>
<span className="text-label-caps font-label-caps text-primary">Details</span>
</div>
{/* Step 2 */}
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold border-2 border-surface-variant">2</div>
<span className="text-label-caps font-label-caps text-on-surface-variant">Review</span>
</div>
{/* Step 3 */}
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold border-2 border-surface-variant">3</div>
<span className="text-label-caps font-label-caps text-on-surface-variant">Post</span>
</div>
</div>
</div>
{/* Form Container */}
<div className="bg-surface shadow-[0px_4px_12px_rgba(46,49,146,0.05)] rounded-xl overflow-hidden border border-surface-variant/50">
<div className="p-stack-lg border-b border-surface-variant/30 flex justify-between items-center bg-surface-bright">
<div>
<h1 className="text-headline-md font-headline-md text-on-surface">Post a New Task</h1>
<p className="text-body-sm text-on-surface-variant">Fill in the details to reach our network of vetted freelancers.</p>
</div>
<span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '48px' }}>post_add</span>
</div>
<form onSubmit={handleSubmit} className="p-stack-lg space-y-stack-lg">
{error && (
  <div className="p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-start gap-3">
    <span className="material-symbols-outlined text-error">error</span>
    <p className="text-body-sm mt-0.5">{error}</p>
  </div>
)}
{/* Section: Basic Info */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
<div className="space-y-2 col-span-2 md:col-span-1">
<label className="text-label-caps font-label-caps text-on-surface-variant">Task Title</label>
<input 
  required 
  value={title} 
  onChange={(e) => setTitle(e.target.value)} 
  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md placeholder:text-outline" 
  placeholder="e.g., Design a high-conversion landing page" 
  type="text"
/>
</div>
<div className="space-y-2 col-span-2 md:col-span-1">
<label className="text-label-caps font-label-caps text-on-surface-variant">Category</label>
<select 
  value={category} 
  onChange={(e) => setCategory(e.target.value)} 
  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md bg-white"
>
<option>UI/UX Design</option>
<option>Web Development</option>
<option>Software Development</option>
<option>Graphic Design</option>
<option>Video Editing</option>
<option>Digital Marketing</option>
<option>Content Writing</option>
<option>SEO Strategy</option>
<option>Virtual Assistant</option>
<option>Data Entry</option>
<option>Translation</option>
<option>Other</option>
</select>
</div>
<div className="space-y-2 col-span-2">
<label className="text-label-caps font-label-caps text-on-surface-variant">Task Deadline</label>
<div className="relative">
<input 
  type="date" 
  value={deadline}
  onChange={(e) => setDeadline(e.target.value)}
  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md bg-white cursor-pointer"
/>
</div>
</div>
<div className="space-y-2 col-span-2">
<div className="flex justify-between items-end">
  <label className="text-label-caps font-label-caps text-on-surface-variant">Task Description</label>
  <button 
    type="button" 
    onClick={handleGenerateAI}
    disabled={generating}
    className="flex items-center gap-1 text-[12px] font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full hover:bg-secondary/20 transition-colors disabled:opacity-50"
  >
    <span className={`material-symbols-outlined text-[16px] ${generating ? 'animate-spin' : ''}`}>
      {generating ? 'progress_activity' : 'auto_awesome'}
    </span>
    {generating ? 'Generating...' : 'AI Generate'}
  </button>
</div>
<textarea 
  required 
  value={description} 
  onChange={(e) => setDescription(e.target.value)} 
  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md placeholder:text-outline resize-none" 
  placeholder="Describe the deliverables, timeline, and any specific requirements..." 
  rows="5"
></textarea>
</div>
</div>
{/* Section: Budgeting */}
<div className="pt-stack-md space-y-stack-md">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>payments</span>
<h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">Set Your Budget</h2>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
<button onClick={() => setBudget(100)} className={`flex flex-col items-center justify-center p-stack-md border-2 rounded-xl transition-all group ${budget === 100 ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant hover:border-primary-container hover:bg-surface-container-low'}`} type="button">
<span className={`text-label-caps font-label-caps ${budget === 100 ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Micro</span>
<span className={`text-budget-display font-budget-display ${budget === 100 ? 'text-primary' : 'text-on-surface'}`}>₹100</span>
</button>
<button onClick={() => setBudget(500)} className={`flex flex-col items-center justify-center p-stack-md border-2 rounded-xl transition-all group ${budget === 500 ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant hover:border-primary-container hover:bg-surface-container-low'}`} type="button">
<span className={`text-label-caps font-label-caps ${budget === 500 ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Standard</span>
<span className={`text-budget-display font-budget-display ${budget === 500 ? 'text-primary' : 'text-on-surface'}`}>₹500</span>
</button>
<button onClick={() => setBudget(1000)} className={`flex flex-col items-center justify-center p-stack-md border-2 rounded-xl transition-all group ${budget === 1000 ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant hover:border-primary-container hover:bg-surface-container-low'}`} type="button">
<span className={`text-label-caps font-label-caps ${budget === 1000 ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Premium</span>
<span className={`text-budget-display font-budget-display ${budget === 1000 ? 'text-primary' : 'text-on-surface'}`}>₹1000</span>
</button>
<div className="relative group">
<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
<span className="text-body-md font-bold text-on-surface-variant">₹</span>
</div>
<input 
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
  className={`w-full h-full min-h-[84px] pl-8 pr-4 border-2 border-dashed rounded-xl text-budget-display font-budget-display focus:border-primary focus:ring-0 outline-none transition-all text-center ${![100, 500, 1000].includes(Number(budget)) ? 'border-primary bg-primary-fixed/10 text-primary' : 'border-outline-variant text-on-surface placeholder:text-outline-variant'}`} 
  placeholder="Custom" 
  type="number"
/>
</div>
</div>
</div>
{/* Section: Attachments/Details */}
<div className="bg-surface-container-low rounded-lg p-stack-md flex items-center justify-between border border-outline-variant/20">
<div className="flex items-center gap-4">
<div className="bg-white p-3 rounded-full shadow-sm">
<span className={`material-symbols-outlined ${attachment ? 'text-primary' : 'text-on-surface-variant'}`}>
  {attachment ? 'check_circle' : 'attach_file'}
</span>
</div>
<div>
<p className="text-body-md font-semibold text-on-surface">
  {attachment ? attachment.name : "Add Attachments"}
</p>
<p className="text-body-sm text-on-surface-variant">
  {attachment ? `${(attachment.size / 1024 / 1024).toFixed(2)} MB` : "PDF, JPEG, or PNG (Max 10MB)"}
</p>
</div>
</div>
<input 
  type="file" 
  className="hidden" 
  ref={fileInputRef} 
  onChange={(e) => setAttachment(e.target.files[0])}
  accept=".pdf,.jpeg,.jpg,.png"
/>
<button 
  onClick={() => fileInputRef.current?.click()}
  className="px-4 py-2 bg-white border border-outline-variant rounded-lg text-label-caps font-label-caps hover:bg-surface-variant transition-colors" 
  type="button"
>
  {attachment ? 'Change' : 'Upload'}
</button>
</div>
{/* Form Actions */}
<div className="pt-stack-lg flex flex-col md:flex-row gap-stack-md justify-between items-center">
<button className="text-on-surface-variant font-label-caps text-label-caps flex items-center gap-2 hover:text-on-surface" type="button">
<span className="material-symbols-outlined">save</span>
                        Save as Draft
                    </button>
<div className="flex gap-stack-md w-full md:w-auto">
<button onClick={() => navigate(-1)} className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-surface-variant text-on-surface-variant font-label-caps text-label-caps font-bold hover:bg-surface-dim transition-colors" type="button">Back</button>
<button disabled={loading} className="flex-1 md:flex-none px-12 py-3 rounded-lg bg-secondary text-on-secondary font-label-caps text-label-caps font-bold shadow-md hover:bg-secondary/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100" type="submit">
                            {loading ? (
                              <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Posting...</>
                            ) : (
                              <>Review &amp; Post <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span></>
                            )}
</button>
</div>
</div>
</form>
</div>
{/* Tip Box */}
<div className="mt-stack-lg flex gap-4 p-stack-md bg-secondary-container/20 border border-secondary/10 rounded-xl">
<span className="material-symbols-outlined text-secondary" data-weight="fill">lightbulb</span>
<p className="text-body-sm text-on-secondary-fixed-variant">
<span className="font-bold">Pro Tip:</span> Detailed descriptions attract 40% more qualified applicants. Mention the specific tools or skills required to filter for the best experts.
            </p>
</div>

</main>
  );
}
