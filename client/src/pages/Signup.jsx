import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TechBackground from '../components/TechBackground'; // Using TechBackground

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', registrationNumber: '', mobileNumber: '', emailId: '',
    isGECVaishaliStudent: true, collegeName: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signupUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError(''); setSuccess('');
  };

  const validateForm = () => {
    // Basic validations, server-side is more critical
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long'); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      const signupData = {
        name: formData.name.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        emailId: formData.emailId.trim().toLowerCase(),
        isGECVaishaliStudent: formData.isGECVaishaliStudent,
        collegeName: formData.isGECVaishaliStudent ? undefined : formData.collegeName.trim(),
        password: formData.password
      };
      const result = await signupUser(signupData);
      if (result.success) {
        setSuccess(`Registration successful! Your User ID is: ${result.data.userId}`);
        setTimeout(() => navigate('/dashboard'), 3000); // Longer delay to read User ID
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <TechBackground />
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="glass-card rounded-2xl p-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-900 via-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-cyan-400/50">
              <span className="text-white font-bold text-4xl code-font" style={{ textShadow: '0 0 10px rgba(10, 236, 234, 0.7)' }}>V</span>
            </div>
            <h2 className="text-3xl font-bold text-white code-font">Create Account</h2>
            <p className="mt-2 text-gray-400">Join Vision Fest '25</p>
          </div>

          {/* Signup Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField id="name" name="name" type="text" placeholder="Full Name *" value={formData.name} onChange={handleInputChange} required />
            <InputField id="registrationNumber" name="registrationNumber" type="text" placeholder="Registration Number *" value={formData.registrationNumber} onChange={handleInputChange} required />
            <InputField id="mobileNumber" name="mobileNumber" type="tel" placeholder="10-Digit Mobile Number *" value={formData.mobileNumber} onChange={handleInputChange} maxLength="10" required />
            <InputField id="emailId" name="emailId" type="email" placeholder="Email ID *" value={formData.emailId} onChange={handleInputChange} required />
            
            <div className="flex items-center">
              <input id="isGECVaishaliStudent" name="isGECVaishaliStudent" type="checkbox" checked={formData.isGECVaishaliStudent} onChange={handleInputChange} className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700/50" />
              <label htmlFor="isGECVaishaliStudent" className="ml-2 block text-sm text-gray-300">GEC Vaishali Student?</label>
            </div>

            {!formData.isGECVaishaliStudent && (
              <InputField id="collegeName" name="collegeName" type="text" placeholder="College Name *" value={formData.collegeName} onChange={handleInputChange} required />
            )}

            <PasswordField placeholder="Password *" value={formData.password} onChange={handleInputChange} name="password" show={showPassword} toggleShow={() => setShowPassword(!showPassword)} />
            <PasswordField placeholder="Confirm Password *" value={formData.confirmPassword} onChange={handleInputChange} name="confirmPassword" show={showConfirmPassword} toggleShow={() => setShowConfirmPassword(!showConfirmPassword)} />
            <p className="text-xs text-gray-400">Password must be 8+ characters with one special character.</p>
            
            {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">{error}</div>}
            {success && <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-md text-sm">{success}</div>}

            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'REGISTER'}
            </button>
            
            <p className="text-center text-sm text-gray-400 pt-2">
              Already have an account? <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">Sign in here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field component for a consistent tech look
const InputField = ({ id, name, type, placeholder, value, onChange, required = false, maxLength }) => (
  <div>
    <label htmlFor={id} className="sr-only">{placeholder}</label>
    <input
      id={id} name={name} type={type} required={required} value={value} onChange={onChange} maxLength={maxLength}
      className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
      placeholder={placeholder}
    />
  </div>
);

// Reusable Password Field component
const PasswordField = ({ placeholder, value, onChange, name, show, toggleShow }) => (
  <div className="relative">
    <label htmlFor={name} className="sr-only">{placeholder}</label>
    <input
      id={name} name={name} type={show ? 'text' : 'password'} required value={value} onChange={onChange}
      className="w-full px-4 py-3 pr-10 bg-gray-700/50 border-2 border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
      placeholder={placeholder}
    />
    <button type="button" onClick={toggleShow} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400">
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  </div>
);

const EyeIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>;

export default Signup;