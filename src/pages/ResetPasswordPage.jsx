import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { adminAuth } from '../admin/services/adminAuth';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export function ResetPasswordPage() {
  const navigate = useNavigate();

  // Form State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status State
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Detect recovery session or URL hash error on mount
  useEffect(() => {
    let isMounted = true;

    async function checkRecoverySession() {
      // 1. Check for errors in the URL hash (e.g. expired link)
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashError = hashParams.get('error');
        const hashErrorCode = hashParams.get('error_code');
        const hashErrorDescription = hashParams.get('error_description');

        if (hashError || hashErrorCode) {
          if (isMounted) {
            setSessionError(
              hashErrorDescription
                ? decodeURIComponent(hashErrorDescription).replace(/\+/g, ' ')
                : 'Tautan pemulihan password sudah kedaluwarsa atau tidak valid.'
            );
            setHasValidSession(false);
            setIsCheckingSession(false);
          }
          return;
        }
      }

      // 2. Check existing session from Supabase
      try {
        const { data, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          console.warn('[ResetPassword] Session check error:', sessionErr);
        }

        // If session exists or window hash contains recovery type, consider valid
        const hashContainsRecovery =
          typeof window !== 'undefined' &&
          window.location.hash &&
          (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'));

        if (data?.session || hashContainsRecovery || adminAuth.isRecoveryMode()) {
          if (isMounted) {
            setHasValidSession(true);
            setIsCheckingSession(false);
          }
          return;
        }

        // Wait brief delay for Supabase client detectSessionInUrl to parse tokens
        setTimeout(async () => {
          if (!isMounted) return;
          const { data: retryData } = await supabase.auth.getSession();
          if (retryData?.session || adminAuth.isRecoveryMode()) {
            setHasValidSession(true);
          } else {
            setHasValidSession(false);
            setSessionError('Tidak ditemukan sesi pemulihan aktif. Pastikan Anda membuka tautan dari email resmi Haecca.');
          }
          setIsCheckingSession(false);
        }, 600);
      } catch (err) {
        if (isMounted) {
          setHasValidSession(false);
          setSessionError('Terjadi kendala saat memeriksa sesi: ' + err.message);
          setIsCheckingSession(false);
        }
      }
    }

    checkRecoverySession();

    // 3. Listen to Supabase onAuthStateChange for PASSWORD_RECOVERY
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) {
        setHasValidSession(true);
        setIsCheckingSession(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!password) {
      setError('Harap masukkan password baru.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    setLoading(true);

    try {
      // Update password via adminAuth / supabase.auth.updateUser
      const { data, error: updateErr } = await adminAuth.updateUserPassword(password);

      if (updateErr) {
        setError(updateErr.message || 'Gagal memperbarui password. Silakan coba kembali.');
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError('Terjadi kendala saat menyimpan password baru: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToLogin = async () => {
    // Clear recovery session cleanly so user logs in with new credentials
    try {
      await adminAuth.signOut();
    } catch (e) {}
    navigate('/admin/login');
  };

  return (
    <>
      <SEO title="Buat Password Baru | Haecca Hijab" noindex={true} />
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-left">
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
              Buat Password Baru
            </h2>
            <p className="text-xs text-stone-500">
              Perbarui password akun Administrator Haecca Hijab Anda dengan aman.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft">
            {/* 1. CHECKING STATE */}
            {isCheckingSession && (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-mocha-500 mx-auto" />
                <p className="text-sm font-medium text-espresso-900">
                  Memverifikasi tautan pemulihan...
                </p>
                <p className="text-xs text-stone-400">
                  Mohon tunggu sebentar selagi kami mengamankan sesi Anda.
                </p>
              </div>
            )}

            {/* 2. INVALID / EXPIRED SESSION STATE */}
            {!isCheckingSession && !hasValidSession && !isSuccess && (
              <div className="space-y-5 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-espresso-950">
                    Sesi Tidak Valid atau Kedaluwarsa
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                    {sessionError ||
                      'Tautan pemulihan password sudah kedaluwarsa atau Anda membuka halaman ini secara langsung tanpa token reset.'}
                  </p>
                </div>

                <div className="pt-3 space-y-2">
                  <Link
                    to="/admin/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-mocha-500 hover:bg-mocha-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Halaman Login</span>
                  </Link>
                  <p className="text-[11px] text-stone-400 pt-1">
                    Silakan gunakan fitur "Lupa Password" di halaman login untuk meminta tautan baru.
                  </p>
                </div>
              </div>
            )}

            {/* 3. SUCCESS STATE */}
            {isSuccess && (
              <div className="space-y-5 text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto animate-bounce-short">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-espresso-950">
                    Password Berhasil Diperbarui
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                    Password akun administrator Anda telah berhasil diubah. Silakan masuk kembali menggunakan password baru Anda.
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleReturnToLogin}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-mocha-500 hover:bg-mocha-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                  >
                    <span>Masuk dengan Password Baru</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. ACTIVE RESET FORM */}
            {!isCheckingSession && hasValidSession && !isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Sesi pemulihan terverifikasi. Silakan tentukan password baru yang kuat untuk akun Anda.
                  </span>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Input: Password Baru */}
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
                    Password Baru <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-sand-200 rounded-xl text-sm text-espresso-900 focus:outline-none focus:border-mocha-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Input: Konfirmasi Password */}
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
                    Konfirmasi Password Baru <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-sand-200 rounded-xl text-sm text-espresso-900 focus:outline-none focus:border-mocha-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2"
                    loading={loading}
                  >
                    <span>Simpan Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/admin/login"
                      className="text-xs text-stone-500 hover:text-mocha-600 transition-colors"
                    >
                      ← Batal dan Kembali ke Login
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
