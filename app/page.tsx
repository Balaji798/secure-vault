'use client';

import { useEffect, useState } from 'react';
import { useVault } from '@/hooks/use-vault';

export default function Home() {
  const {
    isUnlocked,
    isLoading,
    secrets,
    error,
    unlockVault,
    lockVault,
    createSecret,
    deleteSecret,
    generatePassword,
    searchSecrets
  } = useVault();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);
  const [clearTimer, setClearTimer] = useState<NodeJS.Timeout | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSecret, setNewSecret] = useState({
    name: '',
    username: '',
    password: '',
    notes: ''
  });
const togglePasswordVisibility = (secretId: string) => {
  const newVisible = new Set(visiblePasswords);
  if (newVisible.has(secretId)) {
    newVisible.delete(secretId);
  } else {
    newVisible.add(secretId);
  }
  setVisiblePasswords(newVisible);
};
 
const revealPasswordTemporarily = (secretId: string) => {
  setRevealedSecret(secretId);
  setTimeout(() => setRevealedSecret(null), 5000); // Hide after 5 seconds
};
 
const copyToClipboard = async (text: string, secretId: string) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopiedSecret(secretId);
    
    // Clear clipboard after 30 seconds for security
    const timer = setTimeout(async () => {
      await navigator.clipboard.writeText('');
      setCopiedSecret(null);
    }, 30000);
    
    setClearTimer(timer);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
  const filteredSecrets = searchSecrets(searchQuery);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl"></div>

        <div className="relative w-full max-w-md">
          {/* Glass card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl lg:p-8 p-4">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Secure Vault</h1>
              <p className="text-white/70 text-sm">Your digital fortress</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              await unlockVault(password);
            }} className="space-y-6">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-3">Master Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your master password"
                    className="w-full lg:px-4 px-2 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-white/70 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-red-200 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Unlocking...
                  </span>
                ) : 'Unlock Vault'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl"></div>

      <div className="relative z-10 lg:p-6 p-2">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl lg:p-6 p-2 mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Secure Vault</h1>
                  <p className="text-white/70 text-sm">{secrets.length} secrets stored</p>
                </div>
              </div>
              <div className='flex gap-4'>
                <button
                  onClick={lockVault}
                  className="bg-red-500/20 border border-red-500/30 text-red-300 lg:px-6 px-4 py-2.5 rounded-xl font-medium hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm"
                >
                  Lock Vault
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Secret</span>
                </button>
              </div>
            </div>

            {/* Search and Add */}
            <div className="flex gap-4 mt-6">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-3 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search secrets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 lg:py-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Add Secret Form */}
          {showAddForm && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl lg:p-6 p-2 mb-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Secret
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={newSecret.name}
                  onChange={(e) => setNewSecret({ ...newSecret, name: e.target.value })}
                  className="w-full lg:px-4 px-2 lg:py-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="Username/Email"
                  value={newSecret.username}
                  onChange={(e) => setNewSecret({ ...newSecret, username: e.target.value })}
                  className="w-full lg:px-4 px-2 lg:py-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                />
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Password"
                    value={newSecret.password}
                    onChange={(e) => setNewSecret({ ...newSecret, password: e.target.value })}
                    className="flex-1 lg:px-4 px-2 lg:py-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                  <button
                    onClick={() => setNewSecret({ ...newSecret, password: generatePassword() })}
                    className="bg-purple-600/20 border border-purple-500/30 text-purple-300 px-4 py-3 rounded-xl font-medium hover:bg-purple-600/30 transition-all duration-200 backdrop-blur-sm whitespace-nowrap"
                  >
                    🎲 Generate
                  </button>
                </div>
                <textarea
                  placeholder="Notes (optional)"
                  value={newSecret.notes}
                  onChange={(e) => setNewSecret({ ...newSecret, notes: e.target.value })}
                  className="w-full lg:px-4 px-2 lg:py-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      await createSecret(newSecret);
                      setNewSecret({ name: '', username: '', password: '', notes: '' });
                      setShowAddForm(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                  >
                    Save Secret
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-white/10 border border-white/20 text-white/70 px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Secrets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSecrets.map(secret => (
              <div key={secret.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-200 group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">{secret.name}</h3>
                    <p className="text-white/70 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {secret.username}
                    </p>
                  </div>
                  <button
                    onClick={async () => await deleteSecret(secret.id)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500/20 border border-red-500/30 text-red-300 p-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
<div className="space-y-3">
  {/* Password row */}
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
      <span className="text-white/50 text-sm">
        {visiblePasswords.has(secret.id) || revealedSecret === secret.id 
          ? secret.password 
          : '••••••••'
        }
      </span>
    </div>
    
    <div className="flex items-center space-x-2">
      {/* Show/Hide toggle */}
      <button
        onClick={() => togglePasswordVisibility(secret.id)}
        className="text-white/50 hover:text-white transition-colors p-1"
        title={visiblePasswords.has(secret.id) ? "Hide password" : "Show password"}
      >
        {visiblePasswords.has(secret.id) ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
      
      {/* Copy button */}
      <button
        onClick={() => copyToClipboard(secret.password, secret.id)}
        className="text-white/50 hover:text-white transition-colors p-1"
        title="Copy password"
      >
        {copiedSecret === secret.id ? (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  </div>
  
  {/* Notes section */}
  {secret.notes && (
    <div className="text-white/50 text-xs">
      <p className="truncate">{secret.notes}</p>
    </div>
  )}
</div>
              </div>
            ))}
            {filteredSecrets.length === 0 && (
              <div className="col-span-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-white/70 text-lg">
                  {searchQuery ? 'No secrets found' : 'No secrets yet'}
                </p>
                <p className="text-white/50 text-sm mt-2">
                  {searchQuery ? 'Try a different search term' : 'Add your first secret to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}