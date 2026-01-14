
import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, AlertCircle, Briefcase, Cpu, CheckCircle2 } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface Props {
  // Updated onLogin type to accept Promise<any> to resolve type mismatch with handleLogin
  onLogin: (username: string, password: string, role: UserRole) => Promise<any>;
  error?: string | null;
  isLoading?: boolean;
}

const LoginPage: React.FC<Props> = ({ onLogin, error: externalError, isLoading: externalLoading }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Manager');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(false);
    setLocalLoading(true);

    try {
      await onLogin(username, password, selectedRole);
    } catch (err) {
      setLocalError(true);
    } finally {
      setLocalLoading(false);
    }
  };

  const isManager = selectedRole === 'Manager';
  const displayError = externalError || (localError ? 'Access Denied: Invalid Credentials' : null);
  const displayLoading = externalLoading || localLoading;

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-4 relative overflow-hidden font-inter">
      <div 
        className={`absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ease-in-out opacity-60 ${
          isManager ? 'bg-[#8A7AB5]/20 translate-x-0' : 'bg-sky-400/15 translate-x-20'
        }`} 
      />
      <div 
        className={`absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ease-in-out opacity-60 ${
          isManager ? 'bg-sky-400/10 -translate-x-20' : 'bg-[#8A7AB5]/15 translate-x-0'
        }`} 
      />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-700">
          
          <div className="pt-12 pb-6 px-10 text-center relative">
            <div className={`mx-auto inline-flex items-center justify-center w-20 h-20 rounded-[28px] text-white shadow-2xl transition-all duration-700 mb-8 relative group ${
              isManager ? 'bg-[#8A7AB5] shadow-[#8A7AB5]/40 rotate-0' : 'bg-sky-400 shadow-sky-400/40 rotate-[360deg]'
            }`}>
              {isManager ? (
                <Shield size={36} className="animate-in zoom-in fade-in duration-500" />
              ) : (
                <Cpu size={36} className="animate-in zoom-in fade-in duration-500" />
              )}
              <div className="absolute inset-0 rounded-[28px] border-2 border-white/20 scale-110 group-hover:scale-125 transition-transform duration-500" />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
              CORE<span className={`transition-colors duration-500 ${isManager ? 'text-[#8A7AB5]' : 'text-sky-400'}`}>PMS</span>
            </h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 opacity-80">
              Terminal Authorization
            </p>
          </div>

          <div className="px-10 mt-2">
            <div className="bg-slate-50 p-1.5 rounded-2xl flex items-center border border-slate-100/80 shadow-inner">
              <button 
                onClick={() => { setSelectedRole('Manager'); setLocalError(false); }}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isManager 
                    ? 'bg-white text-[#8A7AB5] shadow-lg shadow-slate-200/50 translate-y-0 scale-100' 
                    : 'text-slate-400 hover:text-slate-600 scale-95'
                }`}
              >
                <Briefcase size={14} strokeWidth={3} />
                Manager
              </button>
              <button 
                onClick={() => { setSelectedRole('Employee'); setLocalError(false); }}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  !isManager 
                    ? 'bg-white text-sky-500 shadow-lg shadow-slate-200/50 translate-y-0 scale-100' 
                    : 'text-slate-400 hover:text-slate-600 scale-95'
                }`}
              >
                <User size={14} strokeWidth={3} />
                Employee
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 pt-8 space-y-7">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors duration-500 ${
                  isManager ? 'text-[#8A7AB5]' : 'text-sky-400'
                }`}>
                  <User size={14} strokeWidth={2.5} /> Identity Token
                </label>
                <input
                  type="text"
                  required
                  placeholder={isManager ? "Administrative ID (admin)" : "First Name (e.g. aniket)"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-800 transition-all shadow-sm ${
                    isManager ? 'focus:border-[#8A7AB5]/30' : 'focus:border-sky-400/30'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors duration-500 ${
                    isManager ? 'text-[#8A7AB5]' : 'text-sky-400'
                  }`}>
                    <Lock size={14} strokeWidth={2.5} /> Access Key
                  </label>
                  <button type="button" className="text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-tighter">Request Reset?</button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-800 transition-all shadow-sm ${
                    isManager ? 'focus:border-[#8A7AB5]/30' : 'focus:border-sky-400/30'
                  }`}
                />
              </div>
            </div>

            {displayError && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-500 animate-in slide-in-from-top-4 duration-300">
                <AlertCircle size={18} />
                <span className="text-[11px] font-black uppercase tracking-wider">{displayError}</span>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={displayLoading}
                className={`w-full py-4.5 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.25em] shadow-xl transition-all duration-500 active:scale-[0.97] flex items-center justify-center gap-3 disabled:opacity-70 group overflow-hidden relative ${
                  isManager 
                    ? 'bg-slate-900 shadow-slate-900/15 hover:bg-[#8A7AB5] hover:shadow-[#8A7AB5]/30' 
                    : 'bg-slate-900 shadow-slate-900/15 hover:bg-sky-500 hover:shadow-sky-400/30'
                }`}
              >
                {displayLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Establish Connection</span>
                    <ArrowRight size={16} strokeWidth={3} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>

              <div className="flex items-center justify-center gap-2 opacity-60">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted Auth</span>
              </div>
            </div>
          </form>

          <div className="p-8 bg-slate-50/70 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {selectedRole} Protocol Active • v2.8.5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
