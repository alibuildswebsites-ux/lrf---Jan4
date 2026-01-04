import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateUserName, updateUserPassword } from '../../lib/firebase/auth';
import { User, Lock, Mail, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess('');
    setNameLoading(true);

    if (!user) {
      setNameError('No user found');
      setNameLoading(false);
      return;
    }

    const result = await updateUserName(user, name);
    
    if (result.success) {
      setNameSuccess('Name updated successfully!');
      setTimeout(() => setNameSuccess(''), 3000);
    } else {
      setNameError(result.error || 'Failed to update name');
    }
    
    setNameLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!user) {
      setPasswordError('No user found');
      return;
    }

    setPasswordLoading(true);

    const result = await updateUserPassword(user, newPassword);
    
    if (result.success) {
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } else {
      setPasswordError(result.error || 'Failed to update password');
    }
    
    setPasswordLoading(false);
  };

  const InputField = ({ icon: Icon, label, type, value, onChange, disabled = false, placeholder, required = false }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-charcoal ml-1">{label}</label>
      <div className="relative group">
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${disabled ? 'text-gray-300' : 'text-gray-400 group-focus-within:text-brand'}`} size={20} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border transition-all duration-200 font-medium ${
            disabled 
              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent text-charcoal'
          }`}
        />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-charcoal tracking-tight mb-2">Profile Settings</h1>
        <p className="text-gray-500">Manage your personal information and security preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Personal Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
              <User className="text-brand" size={24} /> Personal Information
            </h2>
            
            {nameSuccess && (
              <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium">
                <CheckCircle size={18} /> {nameSuccess}
              </div>
            )}
            {nameError && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium">
                <AlertCircle size={18} /> {nameError}
              </div>
            )}

            <form onSubmit={handleNameUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputField 
                    icon={Mail} 
                    label="Email Address" 
                    type="email" 
                    value={user?.email || ''} 
                    disabled={true} 
                />
                <InputField 
                    icon={User} 
                    label="Full Name" 
                    type="text" 
                    value={name} 
                    onChange={(e: any) => setName(e.target.value)}
                    required={true}
                    placeholder="John Doe"
                />
              </div>

              <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={nameLoading}
                    className="bg-charcoal text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-charcoal/20"
                  >
                    {nameLoading && <Loader2 className="animate-spin" size={18} />}
                    {nameLoading ? 'Saving...' : 'Save Changes'}
                  </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
              <Shield className="text-brand" size={24} /> Security
            </h2>

            {user?.providerData.some(p => p.providerId === 'google.com') ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
                 <div className="bg-blue-100 p-2 rounded-full h-fit text-blue-600"><Lock size={20}/></div>
                 <div>
                    <h3 className="font-bold text-blue-900 mb-1">Google Account Linked</h3>
                    <p className="text-sm text-blue-700 leading-relaxed">
                        You signed in with Google. To change your password or security settings, please visit your Google Account settings.
                    </p>
                 </div>
              </div>
            ) : (
              <>
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle size={18} /> {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={18} /> {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField 
                        icon={Lock} 
                        label="New Password" 
                        type="password" 
                        value={newPassword} 
                        onChange={(e: any) => setNewPassword(e.target.value)}
                        required={true}
                        placeholder="••••••••"
                    />
                    <InputField 
                        icon={Lock} 
                        label="Confirm Password" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e: any) => setConfirmPassword(e.target.value)}
                        required={true}
                        placeholder="••••••••"
                    />
                  </div>

                  <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-white border-2 border-charcoal text-charcoal px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {passwordLoading && <Loader2 className="animate-spin" size={18} />}
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                      </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;