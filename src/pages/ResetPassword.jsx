import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('request'); // 'request' or 'update'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we arrived via a password reset email link
        if (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token')) {
            setMode('update');
        }
        
        // Listen to auth state changes for PASSWORD_RECOVERY event
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setMode('update');
            }
        });
        
        return () => subscription.unsubscribe();
    }, []);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email first");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: `${window.location.origin}/reset-password`
            }
        );

        if (error) {
            console.log(error);
            setError(error.message);
        } else {
            setMessage("Password reset email sent. Check your inbox.");
        }

        setLoading(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!password) {
            setError("Please enter a new password");
            return;
        }
        
        setLoading(true);
        setError('');
        setMessage('');
        
        const { error } = await supabase.auth.updateUser({
            password: password
        });
        
        if (error) {
            setError(error.message);
        } else {
            setMessage("Password updated successfully. Redirecting to login...");
            setTimeout(() => navigate('/login'), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col justify-center items-center p-gutter">
            <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-sm border border-outline-variant">
                <h2 className="font-headline-md text-headline-md text-primary mb-4">
                    {mode === 'request' ? 'Reset Password' : 'Set New Password'}
                </h2>
                <p className="text-on-surface-variant font-body-sm text-body-sm mb-6">
                    {mode === 'request' 
                        ? 'Enter your email to receive a password reset link.' 
                        : 'Please enter your new password below.'}
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-start gap-3">
                        <span className="material-symbols-outlined text-error">error</span>
                        <p className="text-body-sm mt-0.5">{error}</p>
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-secondary-container text-on-secondary-container rounded-lg border border-secondary/20 flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary">check_circle</span>
                        <p className="text-body-sm mt-0.5">{message}</p>
                    </div>
                )}

                {mode === 'request' ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="email">Work Email</label>
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
                        <button
                            disabled={loading}
                            className="w-full h-12 bg-primary text-on-primary font-label-caps text-label-caps rounded-lg hover:shadow-lg transition-all active:scale-95 duration-150 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
                            type="submit"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full h-12 mt-2 bg-transparent text-primary font-label-caps text-label-caps rounded-lg hover:bg-primary/5 transition-all flex items-center justify-center"
                        >
                            Back to Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="password">New Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant text-on-surface bg-surface-container-lowest"
                                placeholder="Min 8 characters"
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="w-full h-12 bg-primary text-on-primary font-label-caps text-label-caps rounded-lg hover:shadow-lg transition-all active:scale-95 duration-150 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
                            type="submit"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}