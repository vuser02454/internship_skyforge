import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Settings() {
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [email, setEmail] = useState('');
  const [showEmailUpdate, setShowEmailUpdate] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountLast4, setAccountLast4] = useState('8821');
  const [upiId, setUpiId] = useState('');
  const [upiVerificationStatus, setUpiVerificationStatus] = useState('idle'); // idle, email_sent, loading, verified
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAccountLast4, setNewAccountLast4] = useState('');

  const INDIAN_BANKS = [
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank",
    "Punjab National Bank (PNB)",
    "Axis Bank",
    "Canara Bank",
    "Bank of Baroda",
    "Union Bank of India",
    "IndusInd Bank",
    "Bank of India",
    "Kotak Mahindra Bank",
    "IDFC FIRST Bank",
    "Yes Bank",
    "Central Bank of India",
    "Indian Bank",
    "UCO Bank",
    "Bank of Maharashtra",
    "Federal Bank",
    "South Indian Bank",
    "Paytm Payments Bank"
  ];

  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError('Error: ' + error.message);
    } else {
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => { setShowPasswordUpdate(false); setPasswordSuccess(''); }, 3000);
    }
    setIsSavingPassword(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setFullName(data.full_name || '');
          setBio(data.bio || '');
          setSkills(data.skills || []);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
           full_name: fullName,
           bio: bio,
           skills: skills
        })
        .eq('id', user.id);
      
      if (error) {
        alert('Error saving profile: ' + error.message);
      } else {
        alert('Profile saved successfully!');
      }
    } else {
      alert('You must be logged in to save settings.');
    }
    setIsSaving(false);
  };

  const handleChangeEmail = async () => {
    setEmailError('');
    setEmailSuccess('');
    if (!newEmail) {
      setEmailError('Please enter a new email address.');
      return;
    }
    if (newEmail === email) {
      setEmailError('New email must be different from your current email.');
      return;
    }
    setIsChangingEmail(true);
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/login` }
    );
    if (error) {
      setEmailError('Error: ' + error.message);
    } else {
      setEmailSuccess('Confirmation link sent! Check both your old and new email inboxes to complete the change.');
      setNewEmail('');
      setTimeout(() => { setShowEmailUpdate(false); setEmailSuccess(''); }, 5000);
    }
    setIsChangingEmail(false);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setIsAddingSkill(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };
  return (
    <main className="flex-1 lg:ml-64 pt-24 pb-12 px-gutter min-h-screen w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-headline-lg font-headline-lg text-primary mb-2">My Profile</h1>
          <p className="text-body-md text-on-surface-variant">Manage your personal profile, security, and payment preferences.</p>
        </header>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Section 1: Profile Settings */}
          <section className="md:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/30 transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="relative group">
                  {avatar ? (
                    <img 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-low" 
                      src={avatar}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-surface-container-low flex items-center justify-center bg-primary-container text-on-primary-container font-bold text-4xl">
                      {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" />
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                </div>
                <div>
                  <h3 className="text-headline-md font-headline-md text-primary">Profile Details</h3>
                  <p className="text-body-sm text-on-surface-variant">This information will be visible to task posters.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Full Name</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name" 
                  />
                </div>
                <div>
                  <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Professional Bio</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" 
                    rows="3" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell clients about your expertise..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {skills.map(skill => (
                      <span key={skill} className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-label-caps font-label-caps flex items-center gap-1">
                        {skill} 
                        <button onClick={() => removeSkill(skill)} className="material-symbols-outlined text-[14px] hover:text-error transition-colors">close</button>
                      </span>
                    ))}
                    {isAddingSkill ? (
                      <input 
                        type="text" 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)} 
                        onKeyDown={handleAddSkill}
                        onBlur={() => {
                           if(newSkill.trim()) {
                              setSkills([...skills, newSkill.trim()]);
                           }
                           setNewSkill('');
                           setIsAddingSkill(false);
                        }}
                        autoFocus
                        placeholder="Type & press Enter"
                        className="px-3 py-1 text-label-caps rounded-full border border-primary outline-none focus:ring-1 focus:ring-primary w-40"
                      />
                    ) : (
                      <button onClick={() => setIsAddingSkill(true)} className="border border-dashed border-outline text-on-surface-variant px-3 py-1 rounded-full text-label-caps font-label-caps hover:bg-surface-container transition-colors">+ Add Skill</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Payments & Payouts */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/30 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-headline-md font-headline-md text-primary">Payments &amp; Payouts</h3>
                  <p className="text-body-sm text-on-surface-variant">Securely manage your earnings (₹100 - ₹1000 range).</p>
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-caps font-label-caps flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                </span>
              </div>

              {!isEditingBank ? (
                <div className="bg-surface p-4 rounded-lg border border-outline-variant mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-surface-container-highest p-3 rounded-lg">
                      <span className="material-symbols-outlined text-primary">account_balance</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{bankName || 'No Bank Added'} {accountLast4 ? `•••• ${accountLast4}` : ''}</p>
                      <p className="text-body-sm text-on-surface-variant">Primary Payout Account</p>
                    </div>
                  </div>
                  <button onClick={() => { setNewBankName(bankName); setNewAccountLast4(accountLast4); setIsEditingBank(true); }} className="text-primary font-label-caps text-label-caps hover:underline">Edit</button>
                </div>
              ) : (
                <div className="bg-surface p-6 rounded-lg border border-primary mb-6 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-body-md font-bold text-primary mb-4">Edit Bank Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Bank Name</label>
                      <select 
                        value={newBankName} 
                        onChange={(e) => setNewBankName(e.target.value)} 
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant outline-none focus:border-primary bg-surface"
                      >
                        <option value="" disabled>Select a Bank</option>
                        {INDIAN_BANKS.map(bank => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Account Number (Last 4)</label>
                      <input type="text" maxLength={4} value={newAccountLast4} onChange={(e) => setNewAccountLast4(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 8821" className="w-full px-3 py-2 rounded-lg border border-outline-variant outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditingBank(false)} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container rounded-lg">Cancel</button>
                    <button onClick={() => { setBankName(newBankName); setAccountLast4(newAccountLast4); setIsEditingBank(false); }} className="px-4 py-2 text-sm bg-primary text-on-primary rounded-lg font-bold hover:opacity-90">Save Bank</button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                {upiVerificationStatus === 'email_sent' ? (
                  <div className="flex-1 w-full bg-primary-container text-on-primary-container p-4 rounded-lg flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">mark_email_read</span>
                      <div>
                        <p className="font-bold text-sm">Verification Email Sent</p>
                        <p className="text-xs">We sent a secure link to your email to verify <strong>{upiId}</strong>.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setUpiVerificationStatus('verified')} className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-bold hover:opacity-90 transition-opacity">Simulate Click</button>
                      <button onClick={() => setUpiVerificationStatus('idle')} className="px-3 py-1 bg-surface text-on-surface rounded border border-outline-variant text-xs font-bold hover:bg-surface-container transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 w-full">
                      <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">UPI ID</label>
                      <input 
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50" 
                        type="text" 
                        value={upiId} 
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. yourname@okaxis"
                        disabled={upiVerificationStatus === 'verified'}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (!upiId) {
                          alert('Please enter a UPI ID first');
                          return;
                        }
                        setUpiVerificationStatus('email_sent');
                      }}
                      disabled={upiVerificationStatus === 'verified'}
                      className={`mt-0 sm:mt-6 w-full sm:w-auto px-6 py-3 rounded-lg font-label-caps text-label-caps transition-all flex items-center justify-center gap-2 ${
                        upiVerificationStatus === 'verified' ? 'bg-primary text-on-primary' : 
                        'bg-secondary text-on-secondary hover:opacity-90'
                      }`}
                    >
                      {upiVerificationStatus === 'verified' && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                      {upiVerificationStatus === 'verified' ? 'Verified!' : 'Verify New'}
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-tertiary-fixed rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">info</span>
                  <span className="text-body-sm text-on-tertiary-fixed-variant">Automatic payouts occur every Friday for balances over ₹500.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar Sections: Security & Notifications */}
          <aside className="md:col-span-4 space-y-6">
            
            {/* Section 2: Account & Security */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
              <h3 className="text-headline-sm font-headline-sm text-primary mb-6">Security</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-label-caps font-label-caps text-on-surface-variant mb-1">Email Address</label>
                  <p className="text-body-md font-semibold mb-2">{email || 'Not provided'}</p>
                  
                  {!showEmailUpdate ? (
                    <button onClick={() => { setShowEmailUpdate(true); setEmailError(''); setEmailSuccess(''); }} className="text-primary text-body-sm font-semibold hover:underline">Change Email</button>
                  ) : (
                    <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                      <input 
                        type="email" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email address" 
                        className="w-full px-3 py-2 rounded border border-outline-variant text-sm focus:border-primary outline-none" 
                      />
                      {emailError && (
                        <p className="text-xs text-error flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          {emailError}
                        </p>
                      )}
                      {emailSuccess && (
                        <p className="text-xs text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          {emailSuccess}
                        </p>
                      )}
                      <div className="flex gap-2">
                         <button 
                           onClick={handleChangeEmail} 
                           disabled={isChangingEmail}
                           className="flex-1 bg-primary text-on-primary py-1.5 rounded font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                         >
                           {isChangingEmail ? 'Sending...' : 'Send Change Link'}
                         </button>
                         <button 
                           onClick={() => { setShowEmailUpdate(false); setNewEmail(''); setEmailError(''); setEmailSuccess(''); }} 
                           className="px-3 bg-surface-container-high text-on-surface py-1.5 rounded text-sm hover:bg-surface-container-highest transition-colors"
                         >
                           Cancel
                         </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-px bg-outline-variant"></div>
                <div>
                  {!showPasswordUpdate ? (
                    <button onClick={() => { setShowPasswordUpdate(true); setPasswordError(''); setPasswordSuccess(''); }} className="w-full flex items-center justify-between text-on-surface hover:text-primary transition-colors">
                      <span className="font-semibold">Update Password</span>
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-primary">Update Password</span>
                        <button onClick={() => { setShowPasswordUpdate(false); setNewPassword(''); setConfirmPassword(''); setPasswordError(''); }} className="material-symbols-outlined text-on-surface-variant hover:text-error text-sm">close</button>
                      </div>
                      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded border border-outline-variant text-sm focus:border-primary outline-none" />
                      <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded border border-outline-variant text-sm focus:border-primary outline-none" />
                      {passwordError && (
                        <p className="text-xs text-error flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          {passwordError}
                        </p>
                      )}
                      {passwordSuccess && (
                        <p className="text-xs text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          {passwordSuccess}
                        </p>
                      )}
                      <button onClick={handleChangePassword} disabled={isSavingPassword} className="w-full bg-primary text-on-primary py-2 rounded font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">{isSavingPassword ? 'Saving...' : 'Save Password'}</button>
                    </div>
                  )}
                </div>
                <div className="h-px bg-outline-variant"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-on-surface">2FA Security</p>
                    <p className="text-[10px] text-on-surface-variant">Recommended for security</p>
                  </div>
                  <div className="w-12 h-6 bg-secondary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Notifications */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
              <h3 className="text-headline-sm font-headline-sm text-primary mb-6">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">New Task Alerts</span>
                  <input defaultChecked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary" type="checkbox" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Application Updates</span>
                  <input defaultChecked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary" type="checkbox" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Payment Received</span>
                  <input defaultChecked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary" type="checkbox" />
                </div>
                <div className="h-px bg-outline-variant my-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm font-bold text-on-surface">Marketing Push</span>
                  <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary" type="checkbox" />
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-primary p-6 rounded-xl text-on-primary shadow-md">
              <p className="text-body-sm mb-4 opacity-90">Need to pause your account or delete your data permanently?</p>
              <button className="w-full py-2 bg-on-primary text-primary rounded-lg font-label-caps text-label-caps hover:bg-opacity-90 transition-all font-bold">Account Privacy</button>
            </div>
          </aside>
        </div>

        {/* Global Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4 pb-8">
          <button className="px-8 py-3 text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container rounded-lg transition-colors font-bold">Discard Changes</button>
          <button onClick={handleSave} disabled={isSaving} className="px-10 py-3 bg-primary text-on-primary font-label-caps text-label-caps rounded-lg shadow-lg hover:shadow-primary/20 active:scale-95 transition-all font-bold disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </main>
  );
}
