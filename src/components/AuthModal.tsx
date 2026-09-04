import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    registerUser,
    loginAdmin,
    currentUser,
    logoutUser,
    isAdminAuthenticated,
    logoutAdmin,
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authModalMode === 'admin') {
      if (!adminPin.trim()) {
        setErrorMsg('Please enter your Admin PIN or Password.');
        return;
      }
      const success = loginAdmin(adminPin);
      if (!success) {
        setErrorMsg('Invalid Admin Credentials. Try PIN 1234 or admin123');
      }
      return;
    }

    if (authModalMode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please fill in both email and password.');
        return;
      }
      const success = loginUser(email, password);
      if (!success) {
        setErrorMsg('Login failed. Please check your credentials.');
      }
      return;
    }

    if (authModalMode === 'register') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Please complete all fields to register.');
        return;
      }
      registerUser(name, email, password);
    }
  };

  const handleFillDemoCustomer = () => {
    setEmail('alex.johnson@example.com');
    setPassword('password123');
    setErrorMsg('');
  };

  const handleFillDemoAdmin = () => {
    setAdminPin('1234');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Top Header Banner */}
        <div className="bg-[#131921] px-6 py-5 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/20 rounded-xl border border-amber-400/40">
              {authModalMode === 'admin' ? (
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              ) : (
                <User className="w-6 h-6 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-white">
                {authModalMode === 'admin'
                  ? 'Merchant Admin Access'
                  : authModalMode === 'login'
                  ? 'Sign In to Your Account'
                  : 'Create SOA Account'}
              </h3>
              <p className="text-xs text-gray-400">
                {authModalMode === 'admin'
                  ? 'Seller Central Management Portal'
                  : 'Access orders, wishlist & fast checkout'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              authModalMode === 'login'
                ? 'border-amber-500 text-gray-900 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              authModalMode === 'register'
                ? 'border-amber-500 text-gray-900 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('admin');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              authModalMode === 'admin'
                ? 'border-amber-500 text-amber-900 bg-amber-50 font-black'
                : 'border-transparent text-amber-700/70 hover:text-amber-900'
            }`}
          >
            Admin Gate
          </button>
        </div>

        {/* Current Active Status Info if Logged In */}
        {authModalMode === 'login' && currentUser && (
          <div className="m-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-gray-900">Signed in as {currentUser.name}</p>
                <p className="text-gray-500">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={logoutUser}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Sign Out
            </button>
          </div>
        )}

        {authModalMode === 'admin' && isAdminAuthenticated && (
          <div className="m-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Admin Passkey Active</p>
                <p className="text-emerald-700">Full Seller Central privileges unlocked</p>
              </div>
            </div>
            <button
              onClick={logoutAdmin}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Revoke Admin
            </button>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {authModalMode !== 'admin' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center justify-between">
                <span>Admin Passkey / PIN</span>
                <span className="text-[11px] font-normal text-amber-700">Demo PIN: 1234</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter PIN (e.g. 1234 or admin123)"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-amber-300 bg-amber-50/50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="pt-1 flex items-center justify-between text-xs">
            {authModalMode !== 'admin' ? (
              <button
                type="button"
                onClick={handleFillDemoCustomer}
                className="text-amber-700 font-bold hover:underline"
              >
                ⚡ Fill Demo Customer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="text-amber-800 font-black hover:underline"
              >
                ⚡ Auto-fill Demo PIN (1234)
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 font-extrabold rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>
              {authModalMode === 'admin'
                ? 'Authenticate Seller Admin'
                : authModalMode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
