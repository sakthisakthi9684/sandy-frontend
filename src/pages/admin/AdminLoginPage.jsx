import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLoginPage = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@santhiyastylestone.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#FBF7F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#EBDAD4] p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FDF0F2] text-[#B76E79] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#352525]">
            Santhiya Style Stone
          </h1>
          <p className="text-xs text-[#8C7A77]">
            Admin Control Panel & Inventory Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@santhiyastylestone.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
              />
              <Mail className="w-4 h-4 text-[#A89895] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
              />
              <Lock className="w-4 h-4 text-[#A89895] absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Helper Button */}
        <div className="pt-2 border-t border-[#F0E4E0] text-center space-y-2">
          <p className="text-[11px] text-[#8C7A77]">Quick test credentials:</p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="px-3 py-1.5 bg-[#FAF2EE] hover:bg-[#F3E5DE] text-[#8C3A48] rounded-lg text-xs font-medium border border-[#EBDAD4] transition-colors"
          >
            Auto-Fill Demo Admin (admin@santhiyastylestone.com / admin123)
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-[#8C7A77] mb-3">
            Need an admin account?{' '}
            <Link to="/admin/register" className="font-semibold text-[#B76E79] hover:text-[#8C3A48]">
              Register with email verification
            </Link>
          </p>
          <Link to="/" className="text-xs text-[#8C7A77] hover:text-[#B76E79]">
            ← Return to Customer Website
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;

