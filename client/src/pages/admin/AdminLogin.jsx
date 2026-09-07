import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/public/SEOHead';
import logoImg from '../../assets/logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, token, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    const storedToken = localStorage.getItem('ssrc_token');
    if ((user || token) && storedToken) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  const fillDemo = () => {
    setEmail('admin@ssrc.com');
    setPassword('admin123');
  };

  return (
    <>
      <SEOHead title="Admin Login - SSRC Portal" />

      <div className="min-h-screen bg-gradient-to-br from-[#FAF6EF] via-slate-50 to-[#FFFBF0] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
        
        {/* Ambient Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-amber-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Public Website</span>
          </Link>

          {/* Light Theme Login Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-amber-900/10 border-2 border-amber-300/80 text-slate-900 space-y-6">
            
            {/* Header Brand Logo */}
            <div className="text-center space-y-3">
              <div className="h-14 px-4 py-2 rounded-2xl bg-white shadow-md border-2 border-amber-400/90 inline-flex items-center justify-center">
                <img src={`${logoImg}?v=4`} alt="Sri Sai Ram Consultancy" className="h-9 w-auto max-w-[240px] object-contain" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-[#0B2545] tracking-tight">
                  Admin Portal
                </h1>
                <p className="text-amber-700 text-xs font-extrabold uppercase tracking-wider mt-0.5">
                  Sri Sai Ram Consultancy
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Admin Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@ssrc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

            </form>

            {/* Quick Demo Autofill Pill */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs text-amber-800 font-extrabold hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl border border-amber-300 transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Autofill Demo Credentials (admin@ssrc.com / admin123)</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default AdminLogin;
