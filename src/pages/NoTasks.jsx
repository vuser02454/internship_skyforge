import React from 'react';

export default function NoTasks() {
  return (
    <main className="flex-1 lg:ml-64 p-gutter max-w-7xl mx-auto w-full">

{/* Search Context Bar */}
<div className="mb-stack-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<h1 className="text-headline-lg font-headline-lg text-primary">Task Marketplace</h1>
<p className="text-body-md text-on-surface-variant">Showing results for <span className="font-bold text-on-surface">"Senior Blockchain Architect"</span></p>
</div>
<div className="flex items-center gap-stack-sm">
<button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg bg-surface text-body-sm hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-body-md">filter_list</span> Filters
          </button>
<button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg bg-surface text-body-sm hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-body-md">sort</span> Relevant
          </button>
</div>
</div>
{/* Empty State Section (Replaces Live Tasks Grid) */}
<div className="bg-surface rounded-xl shadow-[0px_4px_12px_rgba(46,49,146,0.05)] border border-outline-variant/30 flex flex-col items-center justify-center py-20 px-gutter text-center min-h-[500px]">
<div className="relative mb-8">
<div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl"></div>
<div className="w-48 h-48 bg-surface-container-low rounded-full flex items-center justify-center relative border border-outline-variant/20">
<img alt="No tasks found illustration" className="w-32 h-32 object-contain opacity-80 mix-blend-multiply" data-alt="A sophisticated, high-end 3D digital illustration of a stylized magnifying glass hovering over an empty, clean digital workspace. The scene is illuminated by soft, cinematic indigo and mint green lighting, creating a professional fintech-inspired atmosphere. Minimalist geometric floating shapes and faint data lines suggest a high-tech search environment. The style is clean, corporate modern, and corporate Memphis inspired but with more depth and premium textures." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1UQOJ-E6WBlRjnD8a1j9cKlIL5JuMEHd2MEgbifuUuasSMsOxIHLJ7-lyDasG8nKAISzVK6sjqK_Wz7f0f3kSv39-tW8s1ZPhOcLrjEopPM8X_tOXN3mMPBIDkReomr4LLVmISHkAR07Sovuhl0CQThQrtMyMESaYzCx2I4Dp_gwHaJJR_72XX_3mlq9oEhcOcgNyA1zsb7Ax1u1Ve3cuSySJZwA_9Bfn2izYllHEbSM8rJ15AicnnrWE_Ucp_ikhcFFubCE2nA"/>
<div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
<span className="material-symbols-outlined text-headline-md">search_off</span>
</div>
</div>
</div>
<h2 className="text-headline-md font-headline-md text-primary mb-stack-sm">We couldn't find any tasks</h2>
<p className="text-body-lg text-on-surface-variant max-w-md mx-auto mb-stack-lg leading-relaxed">
          We couldn't find any tasks matching <span className="italic font-medium">"Senior Blockchain Architect"</span>. Try adjusting your search keywords or broadening your filters to see more opportunities.
        </p>
<div className="flex flex-col sm:flex-row items-center gap-stack-md">
<button className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold text-body-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
            Clear Search
          </button>
<button className="bg-surface-container-high text-on-surface px-8 py-3 rounded-xl font-bold text-body-md hover:bg-surface-variant transition-all border border-outline-variant/30">
            Browse All Categories
          </button>
</div>
<div className="mt-12 w-full max-w-2xl pt-12 border-t border-outline-variant/20">
<p className="text-label-caps text-outline mb-stack-md uppercase tracking-widest">Recommended Keywords</p>
<div className="flex flex-wrap justify-center gap-stack-sm">
<button className="px-4 py-2 bg-surface-container-low border border-outline-variant/40 rounded-full text-body-sm text-on-surface hover:border-primary hover:text-primary transition-colors">Blockchain Developer</button>
<button className="px-4 py-2 bg-surface-container-low border border-outline-variant/40 rounded-full text-body-sm text-on-surface hover:border-primary hover:text-primary transition-colors">Web3 Engineer</button>
<button className="px-4 py-2 bg-surface-container-low border border-outline-variant/40 rounded-full text-body-sm text-on-surface hover:border-primary hover:text-primary transition-colors">Smart Contract Audit</button>
<button className="px-4 py-2 bg-surface-container-low border border-outline-variant/40 rounded-full text-body-sm text-on-surface hover:border-primary hover:text-primary transition-colors">Fintech Security</button>
<button className="px-4 py-2 bg-surface-container-low border border-outline-variant/40 rounded-full text-body-sm text-on-surface hover:border-primary hover:text-primary transition-colors">Solidity</button>
</div>
</div>
</div>
{/* Secondary Engagement Section */}
<section className="mt-gutter grid grid-cols-1 md:grid-cols-2 gap-gutter">
<div className="bg-primary-container p-stack-lg rounded-xl text-on-primary-container flex items-center gap-gutter">
<div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[32px]">notifications_active</span>
</div>
<div>
<h3 className="font-headline-md text-body-lg font-bold mb-1">Set a Job Alert</h3>
<p className="text-body-sm opacity-80 mb-stack-md">We'll notify you as soon as a task matching this search becomes available.</p>
<button className="bg-secondary-fixed text-on-secondary-fixed px-4 py-1.5 rounded-lg text-label-caps font-bold">Create Alert</button>
</div>
</div>
<div className="bg-secondary-container p-stack-lg rounded-xl text-on-secondary-container flex items-center gap-gutter">
<div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[32px]">person_search</span>
</div>
<div>
<h3 className="font-headline-md text-body-lg font-bold mb-1">Update Your Profile</h3>
<p className="text-body-sm opacity-80 mb-stack-md">Let top-tier clients find you instead. Improve your visibility score.</p>
<button className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-label-caps font-bold">Go to Profile</button>
</div>
</div>
</section>

</main>
  );
}
