import React from 'react';

export default function Loading() {
  return (
    <main className="flex-grow pt-24 pb-stack-lg px-gutter max-w-container-max mx-auto w-full">

{/* Hero Search Loading State */}
<section className="mb-12">
<div className="w-full h-64 md:h-80 bg-surface-container-lowest rounded-xl p-stack-lg flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
<div className="w-3/4 md:w-1/2 h-10 skeleton rounded-lg mb-6"></div>
<div className="w-full max-w-2xl flex flex-col md:flex-row gap-4">
<div className="flex-grow h-14 skeleton rounded-lg border border-outline-variant"></div>
<div className="w-full md:w-32 h-14 bg-primary skeleton rounded-lg opacity-80"></div>
</div>
<div className="mt-6 flex gap-3">
<div className="w-20 h-6 skeleton rounded-full"></div>
<div className="w-24 h-6 skeleton rounded-full"></div>
<div className="w-20 h-6 skeleton rounded-full"></div>
</div>
</div>
</section>
{/* Live Tasks Header Skeleton */}
<div className="flex justify-between items-end mb-6">
<div>
<div className="w-48 h-8 skeleton rounded mb-2"></div>
<div className="w-64 h-4 skeleton rounded opacity-60"></div>
</div>
<div className="w-24 h-10 skeleton rounded-lg"></div>
</div>
{/* Live Tasks Grid (Asymmetric Bento Style) */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
{/* Large Featured Card */}
<div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
<div className="flex justify-between">
<div className="w-16 h-16 skeleton rounded-lg"></div>
<div className="w-20 h-8 skeleton rounded-full"></div>
</div>
<div className="w-3/4 h-8 skeleton rounded"></div>
<div className="w-full h-20 skeleton rounded"></div>
<div className="mt-auto flex justify-between items-center pt-4 border-t border-outline-variant">
<div className="flex gap-2">
<div className="w-24 h-6 skeleton rounded-full"></div>
<div className="w-24 h-6 skeleton rounded-full"></div>
</div>
<div className="w-32 h-10 skeleton rounded-lg bg-primary opacity-20"></div>
</div>
</div>
{/* Small Stat/Quick Task */}
<div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
<div className="w-12 h-12 skeleton rounded-full"></div>
<div className="w-1/2 h-6 skeleton rounded"></div>
<div className="w-full h-4 skeleton rounded"></div>
<div className="w-2/3 h-4 skeleton rounded"></div>
<div className="mt-auto w-full h-10 skeleton rounded-lg"></div>
</div>
{/* Grid Items */}
<div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
<div className="w-full h-32 skeleton rounded-lg"></div>
<div className="w-3/4 h-6 skeleton rounded"></div>
<div className="flex justify-between items-center">
<div className="w-16 h-8 skeleton rounded"></div>
<div className="w-24 h-8 skeleton rounded-full"></div>
</div>
</div>
<div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
<div className="w-full h-32 skeleton rounded-lg"></div>
<div className="w-3/4 h-6 skeleton rounded"></div>
<div className="flex justify-between items-center">
<div className="w-16 h-8 skeleton rounded"></div>
<div className="w-24 h-8 skeleton rounded-full"></div>
</div>
</div>
<div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container flex flex-col gap-4">
<div className="w-full h-32 skeleton rounded-lg"></div>
<div className="w-3/4 h-6 skeleton rounded"></div>
<div className="flex justify-between items-center">
<div className="w-16 h-8 skeleton rounded"></div>
<div className="w-24 h-8 skeleton rounded-full"></div>
</div>
</div>
</div>

</main>
  );
}
