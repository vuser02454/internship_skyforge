import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('freelancer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_role: role,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg("Check your email for the confirmation link to complete registration!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Left Side: Atmospheric Brand Visual */}
      <section className="relative w-full md:w-1/2 h-64 md:h-screen flex flex-col justify-center items-center p-gutter overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Professional Modern Workspace" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX6fKrFiQoia110Ufc06fDPHn0zmkEuRbATcEmjwsIh9lkx1UXAxYx_HdVffRc4ipMeCWtLv2rJUN0PAAWN1XqGyemnFR2gaibCkeCKD0si1eka0wXbSRpjaXAdrrIW5Kr-tickFEvdCMXE-PrVtvlikZyEaMVekw5rYTMRR7I-Hc3CjpQFawJtiv_aTiFwBhr3rizAJGPGQOhQhWzJlLxM-WGYsrlRohJoowJYqx72CpDea08gsVVbaSYC3g4nEeCU-luaMt9GQ" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/40 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="mb-stack-lg">
            <span className="text-on-primary font-headline-lg text-headline-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              TaskForge
            </span>
          </div>
          <h1 className="text-on-primary font-headline-md text-headline-md mb-stack-md">Fueling the Micro-Task Economy</h1>
          <p className="text-on-primary/80 font-body-md text-body-md px-4">The secure bridge between institutional quality requirements and high-performance freelance talent.</p>
        </div>
        
        <div className="absolute bottom-8 left-8 z-10 hidden md:block">
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              <img alt="Avatar" className="h-10 w-10 rounded-full border-2 border-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi_IDzCnr9CkgQa5gsNMcpv7wK6tODlRa_99_NVIo7sKoLiqYQau00C5ZVTPrGvHudwtpI6MMh1XRwENmAdGXoL-aHRx2_DKWTXKD3FCNWGwL0XH_tbF6Zig3fbc4t86BEXPPvVBvfNRCfIV4cFaIEhou1SBGzR33xVuk-1ld953OokOxqO7Avb4LCYgp4MOTU5uSVRSk47nB6XnIcIJTt8zjLD3-Uh8fjVsQzCqKTezrl2diCZmnD7d5JQ4BsCDWzJ2QGzWldJg" />
              <img alt="Avatar" className="h-10 w-10 rounded-full border-2 border-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9YppcreFzFtIjfgyBfCw9zgTFxCE4a0jyy1x7Dxd2B4rAP3p426G2BLCMpijkL2ucfA4zyoTcUTk0rWi8L3btBQjAP01iXNQi6FjwmUlkxwudHWwkuq9BmyP6xWeBVKZGAswzr9T4jag_BFPFQtBWAjXvhr3q4qKb4E0TrnBmET99FO6gXJ3d_MiMd4EP8U1j-AizB30mqI9TZAJ-_nPMQ5x5147AEv9ecadHPYfP8JVLYaURaB2BKshxl74k1uFGnf7oFcW1yQ" />
              <img alt="Avatar" className="h-10 w-10 rounded-full border-2 border-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHm425bK6z0dsFL0SaC_YS6dcIV1vBleF21qrfqiPmPkeNjm-sPrT9HJbN9Eo40t7XTkBJ_T8eUaZslpNphVvgIgitIFcStQ_VizoTW1xoidSDjwBtB5UAKSQXhE9lFV0gupG9xpbHz-eZCGY8aJ7_i30E6xbv-3YTiK22i6OhwYAMa8WwuBRVxrsMGpfiSW-4sDFWRnD4tGvZhP7nJ4hQqYLRoQ94hEfOLCIBYKHgHquplSGKr4mKeQQwEZgQWQqYhcZlEcYOOg" />
            </div>
            <p className="text-on-primary font-label-caps text-label-caps">Trusted by 12,000+ Professionals</p>
          </div>
        </div>
      </section>

      {/* Right Side: Authentication Form */}
      <main className="w-full md:w-1/2 flex items-center justify-center p-gutter bg-surface">
        <div className="w-full max-w-[440px]">
          
          <div className="mb-stack-lg">
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-sm">Create an account</h2>
            <p className="text-on-surface-variant font-body-sm text-body-sm">Join the platform and start finding opportunities.</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-xl mb-stack-lg">
            <Link to="/login" className="flex-1 text-center py-2 text-label-caps font-label-caps rounded-lg text-on-surface-variant hover:text-primary transition-colors">Login</Link>
            <Link to="/signup" className="flex-1 text-center py-2 text-label-caps font-label-caps rounded-lg bg-surface shadow-[0px_4px_12px_rgba(46,49,146,0.05)] text-primary transition-all">Sign Up</Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-error">error</span>
              <p className="text-body-sm mt-0.5">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-secondary-container text-on-secondary-container rounded-lg border border-secondary/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">mark_email_read</span>
              <p className="text-body-sm mt-0.5">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-stack-md">
            
            {/* Role Selector from the template */}
            <div className="mb-stack-lg">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Joining as</p>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex cursor-pointer rounded-xl border p-3 focus:outline-none transition-colors ${role === 'freelancer' ? 'border-secondary bg-secondary/5' : 'border-outline-variant hover:bg-surface-container'}`}>
                  <input className="sr-only" name="role" type="radio" value="freelancer" checked={role === 'freelancer'} onChange={(e) => setRole(e.target.value)} />
                  <span className="flex flex-col">
                    <span className={`font-label-caps text-[11px] uppercase ${role === 'freelancer' ? 'text-secondary' : 'text-on-surface-variant'}`}>Freelancer</span>
                    <span className={`font-body-sm font-semibold ${role === 'freelancer' ? 'text-primary' : 'text-on-surface'}`}>I want to earn</span>
                  </span>
                  {role === 'freelancer' && <span className="material-symbols-outlined text-secondary ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </label>
                <label className={`relative flex cursor-pointer rounded-xl border p-3 focus:outline-none transition-colors ${role === 'client' ? 'border-secondary bg-secondary/5' : 'border-outline-variant hover:bg-surface-container'}`}>
                  <input className="sr-only" name="role" type="radio" value="client" checked={role === 'client'} onChange={(e) => setRole(e.target.value)} />
                  <span className="flex flex-col">
                    <span className={`font-label-caps text-[11px] uppercase ${role === 'client' ? 'text-secondary' : 'text-on-surface-variant'}`}>Client</span>
                    <span className={`font-body-sm font-semibold ${role === 'client' ? 'text-primary' : 'text-on-surface'}`}>I want to hire</span>
                  </span>
                  {role === 'client' && <span className="material-symbols-outlined text-secondary ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </label>
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-stack-sm" htmlFor="email">Work Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant text-on-surface bg-surface-container-lowest"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-stack-sm" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant text-on-surface bg-surface-container-lowest"
                  placeholder="Min 8 characters"
                />
                <button 
                  className="absolute right-3 top-3 text-on-surface-variant material-symbols-outlined hover:text-primary transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full h-12 bg-primary text-on-primary font-label-caps text-label-caps rounded-lg hover:shadow-lg transition-all active:scale-95 duration-150 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
              type="submit"
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Creating Account...</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant">
            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
              By continuing, you agree to our <a className="text-primary hover:underline font-semibold" href="#">Terms of Service</a> and <a className="text-primary hover:underline font-semibold" href="#">Privacy Policy</a>.
            </p>
            <div className="mt-8 flex justify-center gap-6">
              <span className="flex items-center gap-1 text-[12px] text-on-surface-variant/60 font-label-caps">
                <span className="material-symbols-outlined text-[16px]">lock</span> SSL Secured
              </span>
              <span className="flex items-center gap-1 text-[12px] text-on-surface-variant/60 font-label-caps">
                <span className="material-symbols-outlined text-[16px]">verified_user</span> GDPR Compliant
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
