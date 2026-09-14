import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldAlert, ShieldCheck, Sparkles, AlertCircle, CheckCircle2, Mail, X } from 'lucide-react';
import { adminAuth } from '../services/adminAuth';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { SEO } from '../../components/common/SEO';
import { isSupabaseActive, getProviderStatus } from '../../lib/storage/dataProvider.js';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const provider = getProviderStatus();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('hecca123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // If already logged in, redirect to /admin
  useEffect(() => {
    if (adminAuth.isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await adminAuth.signInWithPassword({
        username,
        password,
      });

      if (authError || !data) {
        setError(authError ? authError.message : 'Kredensial tidak valid');
        return;
      }

      showToast('Selamat datang kembali, Administrator Haecca Hijab! ✨', 'success');
      navigate('/admin');
    } catch (err) {
      setError('Terjadi kendala saat login: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('hecca123');
    setError('');
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    const target = forgotEmail.trim() || (username.includes('@') ? username : 'admin@haeccahijab.com');
    if (!target) {
      setForgotError('Harap masukkan alamat email administrator.');
      return;
    }

    setForgotLoading(true);
    try {
      const { data, error: resetErr } = await adminAuth.resetPasswordForEmail(target);
      if (resetErr) {
        setForgotError(resetErr.message || 'Gagal mengirim tautan reset password.');
        return;
      }

      setForgotSuccess(true);
      showToast('Tautan pemulihan password telah dikirim! Periksa email Anda.', 'success');
    } catch (err) {
      setForgotError('Terjadi kendala saat mengirim email: ' + err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login Admin | Haecca Hijab CMS" noindex={true} />
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <span className="text-3xl tracking-[0.2em] font-bold text-espresso-950 block">
                HAECCA
              </span>
              <span className="text-[9px] tracking-[0.3em] font-medium text-mocha-500 uppercase">
                HIJAB & MODEST
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-espresso-950 pt-2">
              Masuk ke Admin Dashboard
            </h2>
            <p className="text-xs text-stone-500">
              Kelola katalog produk, foto galeri, dan inventaris stok toko Anda.
            </p>
          </div>

          {/* Provider Authentication Status Card */}
          {provider.isSupabase ? (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{provider.badge}</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                {provider.description}. Masukkan email dan password akun administrator untuk masuk ke dashboard.
              </p>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{provider.badge}</span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                {provider.description}. Ini adalah autentikasi demo lokal untuk keperluan demonstrasi portofolio.
              </p>
              <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200 text-xs text-stone-700 flex items-center justify-between">
                <div>
                  <span className="font-mono text-espresso-900 font-bold">admin</span> / <span className="font-mono text-espresso-900 font-bold">hecca123</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] font-semibold text-mocha-600 hover:text-mocha-800 underline"
                >
                  Isi Otomatis
                </button>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft text-left space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
                  {provider.isSupabase ? 'Email atau Username Admin' : 'Username Admin'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={provider.isSupabase ? 'admin@haeccahijab.com' : 'admin'}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-200 rounded-xl text-sm text-espresso-900 focus:outline-none focus:border-mocha-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotError('');
                      setForgotSuccess(false);
                      if (username.includes('@')) {
                        setForgotEmail(username);
                      }
                    }}
                    className="text-[11px] font-semibold text-mocha-600 hover:text-mocha-800 transition-colors"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-200 rounded-xl text-sm text-espresso-900 focus:outline-none focus:border-mocha-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  loading={loading}
                >
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <div className="pt-2 text-center">
              <Link to="/" className="text-xs text-stone-500 hover:text-mocha-600 transition-colors">
                ← Kembali ke Halaman Toko
              </Link>
            </div>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sand-200 shadow-soft text-left space-y-5 relative">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-espresso-900 hover:bg-sand-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1.5 pr-6">
                  <h3 className="text-lg font-bold text-espresso-950">
                    Pemulihan Password
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Masukkan email akun administrator Supabase Anda. Kami akan mengirimkan tautan pemulihan untuk membuat password baru.
                  </p>
                </div>

                {forgotSuccess ? (
                  <div className="space-y-4 pt-1">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1.5">
                      <div className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Email Berhasil Dikirim!</span>
                      </div>
                      <p className="leading-relaxed text-[11px] text-emerald-700">
                        Tautan reset password telah dikirim ke <strong>{forgotEmail || username}</strong>. Silakan periksa kotak masuk atau spam email Anda, lalu klik tautan tersebut untuk diarahkan ke halaman pembuatan password baru.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Tutup
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSendResetEmail} className="space-y-4 pt-1">
                    {forgotError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
                        Alamat Email Admin
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="admin@haeccahijab.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-200 rounded-xl text-sm text-espresso-900 focus:outline-none focus:border-mocha-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        loading={forgotLoading}
                        className="flex items-center gap-1.5"
                      >
                        <span>Kirim Tautan Reset</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
