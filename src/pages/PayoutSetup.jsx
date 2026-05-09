import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function PayoutSetup() {
  const { user } = useAuth();
  const isClient = user?.user_metadata?.user_role === 'client';

  const [payoutType, setPayoutType] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchDetails = async () => {
      const { data } = await supabase
        .from('payout_details')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setPayoutType(data.payout_type || 'upi');
        setUpiId(data.upi_id || '');
        setBankName(data.bank_account_name || '');
        setAccountNumber(data.bank_account_number || '');
        setIfsc(data.bank_ifsc || '');
      }
      setLoading(false);
    };
    fetchDetails();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      user_id: user.id,
      payout_type: payoutType,
      upi_id: payoutType === 'upi' ? upiId : null,
      bank_account_name: payoutType === 'bank' ? bankName : null,
      bank_account_number: payoutType === 'bank' ? accountNumber : null,
      bank_ifsc: payoutType === 'bank' ? ifsc : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('payout_details')
      .upsert(payload, { onConflict: 'user_id' });

    setSaving(false);
    if (error) {
      alert('Failed to save payout details: ' + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <main className="lg:ml-64 pt-24 px-gutter min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
      </main>
    );
  }

  if (isClient) {
    return (
      <main className="lg:ml-64 pt-24 px-gutter pb-12 min-h-screen max-w-2xl mx-auto">
        <div className="bg-surface rounded-xl p-12 text-center border border-outline-variant/30 flex flex-col items-center">
          <span className="material-symbols-outlined text-[64px] text-secondary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2">Clients Don't Need This</h2>
          <p className="text-body-md text-on-surface-variant max-w-sm mb-6">Payout details are for Freelancers. As a client, your payment details are managed securely through Razorpay at checkout.</p>
          <Link to="/dashboard" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-label-caps">Back to Dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="lg:ml-64 pt-24 px-gutter pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-on-surface-variant text-body-sm mb-2">
          <Link to="/settings" className="hover:text-primary transition-colors">Settings</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-semibold">Payout Details</span>
        </nav>
        <h1 className="text-headline-lg font-headline-lg text-primary">Payout Details</h1>
        <p className="text-on-surface-variant text-body-md mt-1">Add your bank or UPI details to receive payments from clients.</p>
      </div>

      <div className="bg-surface rounded-xl p-8 border border-outline-variant/20 ambient-shadow space-y-6">
        {/* Security Notice */}
        <div className="flex items-start gap-3 bg-secondary-container/30 p-4 rounded-lg border border-secondary-container">
          <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface mb-0.5">Secure & Encrypted</p>
            <p className="text-body-sm text-on-surface-variant">Your payment details are stored securely and are never shared with clients.</p>
          </div>
        </div>

        {/* Payout Type Toggle */}
        <div>
          <label className="text-label-caps font-label-caps text-on-surface-variant mb-3 block">Payout Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPayoutType('upi')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                payoutType === 'upi'
                  ? 'border-primary bg-primary-container/40'
                  : 'border-outline-variant hover:border-primary/50'
              }`}
            >
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smartphone</span>
              <div className="text-left">
                <p className="font-bold text-on-surface text-body-md">UPI</p>
                <p className="text-[11px] text-on-surface-variant">Instant transfer</p>
              </div>
              {payoutType === 'upi' && (
                <span className="material-symbols-outlined text-primary ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              )}
            </button>
            <button
              onClick={() => setPayoutType('bank')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                payoutType === 'bank'
                  ? 'border-primary bg-primary-container/40'
                  : 'border-outline-variant hover:border-primary/50'
              }`}
            >
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              <div className="text-left">
                <p className="font-bold text-on-surface text-body-md">Bank Account</p>
                <p className="text-[11px] text-on-surface-variant">1-2 business days</p>
              </div>
              {payoutType === 'bank' && (
                <span className="material-symbols-outlined text-primary ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              )}
            </button>
          </div>
        </div>

        {/* UPI Form */}
        {payoutType === 'upi' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant">Your UPI ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full bg-surface-container-lowest border border-outline rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">alternate_email</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Supports: PhonePe, Google Pay, Paytm, BHIM, etc.</p>
            </div>
          </div>
        )}

        {/* Bank Account Form */}
        {payoutType === 'bank' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant">Account Holder Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Full name as on your bank account"
                className="w-full bg-surface-container-lowest border border-outline rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant">Bank Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your 9-18 digit account number"
                className="w-full bg-surface-container-lowest border border-outline rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. SBIN0001234"
                className="w-full bg-surface-container-lowest border border-outline rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md tracking-widest font-mono"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || (payoutType === 'upi' ? !upiId : (!bankName || !accountNumber || !ifsc))}
          className={`w-full py-4 font-extrabold text-label-caps rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-secondary text-on-secondary'
              : 'bg-primary text-on-primary hover:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {saving ? (
            <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Saving...</>
          ) : saved ? (
            <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Saved Successfully!</>
          ) : (
            <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span> Save Payout Details</>
          )}
        </button>
      </div>
    </main>
  );
}
