import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Lock, Mail, ShieldCheck, UserRound } from 'lucide-react';
import api from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminRegisterPage = () => {
  const { register } = useAdminAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendCode = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register/send-otp', { email });
      setMessage(response.data.message || 'Verification code sent. Please check your email.');
      setStep('verify');
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, otp });
      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#EBDAD4] p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FDF0F2] text-[#B76E79] flex items-center justify-center mx-auto shadow-xs">
            {step === 'details' ? <ShieldCheck className="w-7 h-7" /> : <Mail className="w-7 h-7" />}
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#352525]">Create Admin Account</h1>
          <p className="text-xs text-[#8C7A77]">
            {step === 'details'
              ? 'Enter your details and verify your email to continue.'
              : `Enter the 6-digit code sent to ${email}.`}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && !error && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs">
            {message}
          </div>
        )}

        {step === 'details' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="admin-name" className="block text-xs font-semibold text-[#4A3E3D] mb-1">Full name</label>
              <div className="relative">
                <input
                  id="admin-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                />
                <UserRound className="w-4 h-4 text-[#A89895] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-[#4A3E3D] mb-1">Email address</label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                />
                <Mail className="w-4 h-4 text-[#A89895] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-[#4A3E3D] mb-1">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
                />
                <Lock className="w-4 h-4 text-[#A89895] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="admin-confirm-password" className="block text-xs font-semibold text-[#4A3E3D] mb-1">Confirm password</label>
              <input
                id="admin-confirm-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>{loading ? 'Sending code...' : 'Send verification code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="admin-otp" className="block text-xs font-semibold text-[#4A3E3D] mb-1">Email verification code</label>
              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                className="w-full px-4 py-3 text-center text-lg tracking-[0.4em] bg-[#FAF7F5] border border-[#E0D0CB] rounded-xl focus:outline-none focus:border-[#B76E79] focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-[#B76E79] hover:bg-[#A35964] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>{loading ? 'Verifying...' : 'Verify and create account'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                setMessage('');
                setOtp('');
                setStep('details');
              }}
              className="w-full py-2 text-xs text-[#8C7A77] hover:text-[#B76E79] flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change details or request another code
            </button>
          </form>
        )}

        <div className="text-center border-t border-[#F0E4E0] pt-4">
          <p className="text-xs text-[#8C7A77]">
            Already registered?{' '}
            <Link to="/admin/login" className="font-semibold text-[#B76E79] hover:text-[#8C3A48]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
