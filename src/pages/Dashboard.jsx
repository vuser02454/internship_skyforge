import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [mode, setMode] = useState('earn');
  const navigate = useNavigate();

  const isClient = user?.user_metadata?.user_role === 'client';

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activeTasks, setActiveTasks] = useState([]);
  const [recommendedTasks, setRecommendedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic graph data
  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', user: 0, avg: 40 },
    { month: 'Feb', user: 0, avg: 42 },
    { month: 'Mar', user: 0, avg: 35 },
    { month: 'Apr', user: 0, avg: 45 },
    { month: 'May', user: 0, avg: 38 },
    { month: 'Jun', user: 0, avg: 42 },
    { month: 'Jul', user: 0, avg: 48 },
    { month: 'Aug', user: 0, avg: 50 },
    { month: 'Sep', user: 0, avg: 55 },
    { month: 'Oct', user: 0, avg: 45 },
    { month: 'Nov', user: 0, avg: 55 },
    { month: 'Dec', user: 0, avg: 60 },
  ]);

  const [activityData, setActivityData] = useState([
    { day: 'Mon', user: 0, avg: 20 },
    { day: 'Tue', user: 0, avg: 30 },
    { day: 'Wed', user: 0, avg: 25 },
    { day: 'Thu', user: 0, avg: 40 },
    { day: 'Fri', user: 0, avg: 35 },
    { day: 'Sat', user: 0, avg: 10 },
    { day: 'Sun', user: 0, avg: 15 },
  ]);

  useEffect(() => {
    async function fetchDashboardStats() {
      if (!user) return;
      
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`);
        
      if (error) {
        console.error(error);
        return;
      }
      
      // Calculate total earnings (freelancer) or total spent (client)
      let total = 0;
      let active = [];
      let revData = [...revenueData];
      let actData = [...activityData];

      tasks.forEach(t => {
        const date = new Date(t.created_at);
        const monthIndex = date.getMonth(); // 0-11
        const dayIndex = date.getDay(); // 0-6 (Sun is 0)
        
        // Map Sun=0 to index 6, Mon=1 to index 0, etc.
        const mappedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;

        if (isClient && t.client_id === user.id) {
           if (t.status === 'completed') total += Number(t.budget);
           if (t.status === 'in_progress') active.push(t);
           // Update charts
           revData[monthIndex].user += Number(t.budget) / 1000; // Scaled down for chart
           actData[mappedDayIndex].user += 10; // 10 points per task
        } else if (!isClient && t.freelancer_id === user.id) {
           if (t.status === 'completed') total += Number(t.budget);
           if (t.status === 'in_progress') active.push(t);
           // Update charts
           revData[monthIndex].user += Number(t.budget) / 1000;
           actData[mappedDayIndex].user += 10;
        }
      });
      
      setTotalEarnings(total);
      setActiveTasks(active.slice(0, 3)); // Show top 3 active
      setRevenueData(revData);
      setActivityData(actData);
      
      // Fetch open tasks for "Recommended Jobs"
      const { data: openTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'open')
        .neq('client_id', user.id) // Don't recommend their own jobs
        .order('created_at', { ascending: false })
        .limit(3);
        
      setRecommendedTasks(openTasks || []);
      setLoading(false);
    }
    
    fetchDashboardStats();
  }, [user, isClient]);

  // Dynamic Rank Calculation
  const getRankInfo = (amount) => {
    if (amount < 1000) return { rank: isClient ? 'New Client' : 'New Freelancer', next: 'Bronze', progress: (amount / 1000) * 100, remaining: 1000 - amount };
    if (amount < 5000) return { rank: isClient ? 'Bronze Client' : 'Bronze Freelancer', next: 'Silver', progress: ((amount - 1000) / 4000) * 100, remaining: 5000 - amount };
    if (amount < 20000) return { rank: isClient ? 'Silver Client' : 'Silver Freelancer', next: 'Gold', progress: ((amount - 5000) / 15000) * 100, remaining: 20000 - amount };
    return { rank: isClient ? 'Gold Client' : 'Gold Freelancer', next: 'Max Rank', progress: 100, remaining: 0 };
  };

  const rankInfo = getRankInfo(totalEarnings);

  return (
    <main className="flex-1 lg:ml-64 pt-24 pb-12 p-gutter max-w-full overflow-x-hidden">

{/* View Toggle & Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
<div>
<h1 className="text-headline-lg font-headline-lg text-primary">Overview</h1>
<p className="text-body-md text-on-surface-variant">Manage your tasks and performance metrics.</p>
</div>
{/* Toggle Container */}
<div className="bg-surface-container-high p-1 rounded-full flex items-center shadow-inner">
  <button 
    onClick={() => setMode('earn')}
    className={`px-6 py-2.5 rounded-full font-bold text-label-caps flex items-center gap-2 transition-colors ${mode === 'earn' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
  >
    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: mode === 'earn' ? "'FILL' 1" : "'FILL' 0" }}>currency_rupee</span>
    I want to Earn
  </button>
  <button 
    onClick={() => navigate('/post-task')}
    className={`px-6 py-2.5 rounded-full font-bold text-label-caps flex items-center gap-2 transition-colors ${mode === 'post' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
  >
    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: mode === 'post' ? "'FILL' 1" : "'FILL' 0" }}>post_add</span>
    I want to Post
  </button>
</div>
</div>
{/* Bento Grid Dashboard Layout */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
{/* Large Earnings Card */}
<div id="tour-earnings" className="md:col-span-8 bg-surface rounded-xl p-stack-lg shadow-[0px_4px_12px_rgba(46,49,146,0.05)] border border-outline-variant/30 flex flex-col">
<div className="flex justify-between items-start mb-6">
<div>
<h2 className="text-label-caps text-on-surface-variant mb-1">{isClient ? 'TOTAL SPENT' : 'TOTAL EARNINGS'}</h2>
<span className="text-headline-lg font-headline-lg text-primary">₹ {totalEarnings.toLocaleString('en-IN')}</span>
</div>
<div className="flex gap-2">
<span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-caps flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +12% this month
                            </span>
</div>
</div>
{/* Dual-Bar Revenue Graph */}
<div className="mt-auto pt-4">
<div className="flex items-center gap-4 mb-6">
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-sm bg-primary shadow-sm"></div>
    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Your Revenue</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-sm bg-surface-variant border border-outline-variant"></div>
    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Platform Avg</span>
  </div>
</div>
<div className="h-48 w-full relative flex items-end justify-between gap-1 sm:gap-2">
  {revenueData.map((data, index) => (
    <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative">
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-xl flex flex-col items-center gap-0.5">
        <span className="font-bold text-primary-container">You: ₹{data.user * 1000}</span>
        <span className="text-surface-variant">Avg: ₹{data.avg * 1000}</span>
      </div>
      <div className="flex items-end gap-0.5 sm:gap-1 w-full h-[85%] relative">
        {/* Platform Avg Bar */}
        <div 
          className="flex-1 bg-surface-variant rounded-t-md transition-all duration-500 group-hover:bg-outline-variant opacity-70"
          style={{ height: `${data.avg}%` }}
        ></div>
        {/* User Bar */}
        <div 
          className={`flex-1 rounded-t-md transition-all duration-500 shadow-sm ${data.user > data.avg ? 'bg-primary group-hover:bg-primary/90' : 'bg-secondary group-hover:bg-secondary/90'}`}
          style={{ height: `${data.user}%` }}
        ></div>
      </div>
      <span className="text-[10px] font-bold text-outline uppercase">{data.month}</span>
    </div>
  ))}
</div>
</div>
</div>
{/* Stats Pillar */}
<div className="md:col-span-4 flex flex-col gap-6">
<div className="bg-primary-container text-on-primary-container p-stack-lg rounded-xl shadow-lg relative overflow-hidden group">
<div className="relative z-10">
<p className="text-label-caps opacity-80 mb-1">CURRENT RANK</p>
<h3 className="text-headline-md font-headline-md mb-4">{rankInfo.rank}</h3>
<div className="w-full bg-on-primary-container/20 h-2 rounded-full overflow-hidden mb-2">
<div className="bg-secondary-fixed h-full transition-all duration-1000 ease-out" style={{ width: `${rankInfo.progress}%` }}></div>
</div>
{rankInfo.remaining > 0 ? (
  <p className="text-body-sm opacity-80">₹ {rankInfo.remaining.toLocaleString('en-IN')} until {rankInfo.next} status</p>
) : (
  <p className="text-body-sm opacity-80">You have reached the highest tier!</p>
)}
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[120px]">stars</span>
</div>
</div>
<div className="bg-surface rounded-xl p-stack-lg shadow-sm border border-outline-variant/30 flex-1 flex flex-col">
<h2 className="text-label-caps text-on-surface-variant mb-2">WEEKLY ACTIVITY</h2>
<p className="text-body-sm text-on-surface-variant mb-6">Tasks completed vs Platform Average</p>

{/* Dual-Bar Activity Graph */}
<div className="h-32 w-full mt-auto relative flex items-end justify-between gap-1 sm:gap-2">
  {activityData.map((data, index) => (
    <div key={index} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-lg text-center">
        You: {data.user/10}<br/>Avg: {data.avg/10}
      </div>
      <div className="flex items-end gap-0.5 w-full h-[80%] relative">
        <div 
          className="flex-1 bg-surface-variant rounded-t-sm transition-all duration-300 opacity-60"
          style={{ height: `${data.avg}%` }}
        ></div>
        <div 
          className="flex-1 bg-secondary rounded-t-sm transition-all duration-300 shadow-sm"
          style={{ height: `${data.user}%` }}
        ></div>
      </div>
      <span className="text-[9px] font-bold text-outline uppercase">{data.day}</span>
    </div>
  ))}
</div>
<div className="flex items-center gap-4 mt-6 pt-4 border-t border-outline-variant/30">
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 rounded-sm bg-secondary"></div>
    <span className="text-[10px] font-bold text-on-surface-variant uppercase">You</span>
  </div>
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 rounded-sm bg-surface-variant"></div>
    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Average</span>
  </div>
</div>
</div>
</div>
{/* Active Jobs List */}
<div className="md:col-span-12 lg:col-span-7 bg-surface rounded-xl p-stack-lg shadow-sm border border-outline-variant/30">
<div className="flex justify-between items-center mb-6">
<h2 className="text-headline-md font-headline-md text-primary">Active Tasks</h2>
<button className="text-primary text-label-caps font-bold hover:underline">View All</button>
</div>
<div className="space-y-4">
    {activeTasks.length === 0 && (
      <div className="p-8 text-center border border-outline-variant/50 rounded-lg bg-surface text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">task</span>
        <p>No active tasks right now.</p>
      </div>
    )}
    
    {activeTasks.map((t) => (
      <Link key={t.id} to={`/work-submission?taskId=${t.id}`} className="block p-4 border border-outline-variant/50 rounded-lg hover:border-primary hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface cursor-pointer group">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">code</span>
              </div>
              <div>
                  <h4 className="font-bold text-primary group-hover:underline">{t.title}</h4>
                  <p className="text-body-sm text-on-surface-variant">Category: {t.category}</p>
              </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-caps">₹ {t.budget.toLocaleString('en-IN')}</span>
              <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
          </div>
      </Link>
    ))}
</div>
</div>
{/* Recommended Grid Item */}
<div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
<div className="bg-surface rounded-xl p-stack-lg shadow-sm border border-outline-variant/30 flex-1">
<h2 className="text-label-caps text-on-surface-variant mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">explore</span>
                            RECOMMENDED JOBS
                        </h2>
<div className="space-y-4">
    {recommendedTasks.length === 0 && (
      <div className="p-4 text-center text-on-surface-variant italic">
        No open jobs available right now.
      </div>
    )}

    {recommendedTasks.map((t) => (
      <div key={t.id} className="flex gap-4 items-start pb-4 border-b border-outline-variant/30 last:border-0">
      <div className="flex-1">
      <h4 className="text-body-md font-bold text-primary leading-tight">{t.title}</h4>
      <p className="text-body-sm text-on-surface-variant mt-1">Budget: ₹ {t.budget.toLocaleString('en-IN')}</p>
      </div>
      <Link to="/realtime-tasks" className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-label-caps font-bold hover:bg-primary hover:text-on-primary transition-colors">View</Link>
      </div>
    ))}
</div>
</div>
</div>
</div>
</main>
  );
}
