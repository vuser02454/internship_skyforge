import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { startTour } from './GuidedTour';
import { useUnreadMessages } from '../hooks/useUnreadMessages';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const unreadCount = useUnreadMessages();

  const getHeaderLinkClasses = (path) => {
    if (currentPath === path || (path === '/search' && currentPath.startsWith('/search'))) {
      return "text-primary border-b-2 border-primary pb-1 font-bold text-label-caps uppercase tracking-wider transition-colors";
    }
    return "text-on-surface-variant hover:text-primary transition-colors text-label-caps uppercase tracking-wider";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-gutter h-16 bg-surface shadow-sm transition-all duration-300">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? 'close' : 'menu'}
          </button>

          <Link to="/" className="text-headline-md font-headline-md font-bold text-primary">TaskForge</Link>
          
          <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-2 w-96 border border-outline-variant focus-within:border-primary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm w-full text-on-surface outline-none" placeholder="Search tasks..." type="text" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link id="tour-find-tasks" className={getHeaderLinkClasses("/search")} to="/search">Find Tasks</Link>
          <Link className={getHeaderLinkClasses("/projects")} to="/projects">My Projects</Link>
          <Link className={getHeaderLinkClasses("/messages")} to="/messages">Messages</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">notifications</button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <button onClick={startTour} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors hidden sm:block" title="Start Tour">help_outline</button>
          <div className="h-8 w-px bg-outline-variant mx-1 hidden sm:block"></div>

          {isAuthenticated ? (
            /* Authenticated: show avatar + dropdown */
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 rounded-full border-2 border-primary shadow-sm flex items-center justify-center bg-primary-container text-on-primary-container font-bold text-lg hover:scale-105 transition-transform overflow-hidden"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </button>

              {profileMenuOpen && (
                <>
                  {/* Backdrop to close menu */}
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                  
                  <div className="absolute right-0 top-12 z-50 bg-surface rounded-xl shadow-lg border border-outline-variant/30 py-2 w-56 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-outline-variant/30">
                      <p className="text-body-sm font-bold text-on-surface truncate">{user?.email}</p>
                      <p className="text-label-caps text-on-surface-variant capitalize">{user?.user_metadata?.user_role || 'Freelancer'}</p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">settings</span>
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-error hover:bg-error-container transition-colors w-full text-left"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Not authenticated: show login/signup */
            <>
              <Link to="/login" className="text-on-surface-variant font-bold text-label-caps hover:text-primary transition-colors">Log In</Link>
              <Link to="/signup" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-label-caps transition-transform active:scale-95 shadow-sm">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-16 left-0 bottom-0 w-72 bg-surface z-50 lg:hidden shadow-xl border-r border-outline-variant/30 overflow-y-auto animate-in slide-in-from-left">
            <nav className="p-4 flex flex-col gap-2">
              <MobileNavLink to="/" icon="dashboard" label="Dashboard" currentPath={currentPath} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/search" icon="search" label="Find Tasks" currentPath={currentPath} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/work-submission" icon="work_history" label="Active Tasks" currentPath={currentPath} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/payout-setup" icon="payments" label="Payouts" currentPath={currentPath} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/projects" icon="folder" label="My Projects" currentPath={currentPath} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/messages" icon="chat" label="Messages" currentPath={currentPath} onClick={() => setMobileMenuOpen(false)} badge={unreadCount} />
              <MobileNavLink to="/realtime-tasks" icon="bolt" label="Live Tasks" currentPath={currentPath} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/settings" icon="settings" label="Settings" currentPath={currentPath} onClick={() => setMobileMenuOpen(false)} />
              
              <div className="h-px bg-outline-variant my-2"></div>
              
              {user?.user_metadata?.user_role === 'client' && (
                <Link
                  to="/post-task"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-xl font-bold text-body-md shadow-lg hover:bg-primary/90 active:scale-95 transition-all mt-2"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Post a Task
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

function MobileNavLink({ to, icon, label, currentPath, onClick, badge }) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive
          ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
          : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
      }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-label-caps flex-1">{label}</span>
      {badge > 0 && (
        <span className="bg-error text-on-error text-xs font-bold px-2 py-0.5 rounded-full">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  const unreadCount = useUnreadMessages();

  const isClient = user?.user_metadata?.user_role === 'client';

  const getLinkClasses = (path) => {
    if (currentPath === path) {
      return "flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg font-bold transition-all duration-300 ease-in-out translate-x-1 shadow-sm";
    }
    return "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg transition-all duration-300 ease-in-out hover:translate-x-1";
  };

  return (
    <aside id="tour-sidebar" className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] p-stack-md bg-surface-container-low w-64 border-r border-outline-variant">
      <div className="mb-8 p-4 bg-surface rounded-xl shadow-ambient">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
               <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            )}
          </div>
          <div>
            <h3 className="font-headline-md text-body-md font-bold text-primary">{isClient ? 'Client Account' : 'Pro Freelancer'}</h3>
            <p className="text-label-caps text-secondary font-semibold">Verified Status</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        <Link id="tour-nav-dashboard" className={getLinkClasses("/")} to="/">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-label-caps">Dashboard</span>
        </Link>
        <Link id="tour-nav-active" className={getLinkClasses("/work-submission")} to="/work-submission">
          <span className="material-symbols-outlined">work_history</span>
          <span className="text-label-caps">Active Tasks</span>
        </Link>
        <Link id="tour-nav-earnings" className={getLinkClasses("/payout-setup")} to="/payout-setup">
          <span className="material-symbols-outlined">payments</span>
          <span className="text-label-caps">Payouts</span>
        </Link>
        <Link id="tour-nav-realtime" className={getLinkClasses("/realtime-tasks")} to="/realtime-tasks">
          <span className="material-symbols-outlined">bolt</span>
          <span className="text-label-caps">Live Tasks</span>
        </Link>
        <Link id="tour-nav-messages" className={getLinkClasses("/messages")} to="/messages">
          <span className="material-symbols-outlined">chat</span>
          <span className="text-label-caps flex-1">Messages</span>
          {unreadCount > 0 && (
            <span className="bg-error text-on-error text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        <Link id="tour-nav-settings" className={getLinkClasses("/settings")} to="/settings">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-label-caps">Settings</span>
        </Link>
      </nav>
      {isClient && (
        <Link id="tour-post-task" to="/post-task" className="mt-auto w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-headline-md text-body-md shadow-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">add_circle</span>
          Post a Task
        </Link>
      )}
    </aside>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-stack-lg px-gutter flex flex-col md:flex-row justify-between items-center border-t border-outline-variant bg-inverse-surface text-secondary-fixed mt-24">
      <div className="mb-6 md:mb-0">
        <span className="text-headline-md font-headline-md font-bold text-on-primary">TaskForge</span>
        <p className="text-body-sm text-surface-variant mt-2">© 2026 TaskForge Inc. Secured by Institutional Trust.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <a className="text-label-caps text-surface-variant hover:text-secondary-fixed-dim transition-colors uppercase tracking-widest" href="#">Privacy Policy</a>
        <a className="text-label-caps text-surface-variant hover:text-secondary-fixed-dim transition-colors uppercase tracking-widest" href="#">Terms of Service</a>
        <a className="text-label-caps text-surface-variant hover:text-secondary-fixed-dim transition-colors uppercase tracking-widest" href="#">Trust & Safety</a>
        <a className="text-label-caps text-surface-variant hover:text-secondary-fixed-dim transition-colors uppercase tracking-widest" href="#">Contact Support</a>
      </div>
    </footer>
  );
}

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const unreadCount = useUnreadMessages();

  const getClasses = (path) => {
    // Exact match for home, starts-with for others
    const isActive = path === '/' ? currentPath === '/' : currentPath.startsWith(path);
    return `flex flex-col items-center justify-center w-full py-2 transition-colors ${
      isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
    }`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-outline-variant flex justify-between items-center px-2 pb-safe lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link to="/" className={getClasses("/")}>
        <span className="material-symbols-outlined text-[24px]">dashboard</span>
        <span className="text-[10px] font-medium mt-1">Home</span>
      </Link>
      <Link to="/search" className={getClasses("/search")}>
        <span className="material-symbols-outlined text-[24px]">search</span>
        <span className="text-[10px] font-medium mt-1">Find</span>
      </Link>
      
      {/* Floating Action Button for Posting/Viewing */}
      <Link to="/post-task" className="relative -top-4 bg-primary text-on-primary w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-surface hover:scale-105 transition-transform">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </Link>

      <Link to="/messages" className={`${getClasses("/messages")} relative`}>
        <div className="relative">
          <span className="material-symbols-outlined text-[24px]">chat</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-error text-on-error text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-surface">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-1">Chat</span>
      </Link>
      <Link to="/settings" className={getClasses("/settings")}>
        <span className="material-symbols-outlined text-[24px]">person</span>
        <span className="text-[10px] font-medium mt-1">Profile</span>
      </Link>
    </nav>
  );
}

export default function Layout() {
  return (
    <>
      <Header />
      <Sidebar />
      <div className="min-h-screen flex flex-col pb-20 lg:pb-0">
        <Outlet />
        <Footer />
      </div>
      <BottomNav />
    </>
  );
}
