import React, { useState } from 'react';
import { Loader2, Send, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { validateEmail, validatePhone, validateRequired } from '../lib/validation';
import { CONTACT_DEFAULTS } from '../lib/constants';

interface FormData {
  name: string;
  email: string;
  phone: string;
  method: 'Phone' | 'Email' | 'Text';
  interest: string;
  location: string;
  message: string;
  times: string[];
  botField: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

interface SharedContactFormProps {
  variant?: 'light' | 'dark';
}

export const SharedContactForm: React.FC<SharedContactFormProps> = ({ variant = 'light' }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    method: 'Email',
    interest: CONTACT_DEFAULTS.INTEREST,
    location: CONTACT_DEFAULTS.LOCATION,
    message: '',
    times: [],
    botField: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!validateRequired(data.name, 2)) newErrors.name = 'Name must be at least 2 characters';
    if (!validateEmail(data.email)) newErrors.email = 'Invalid email address';
    if (!validatePhone(data.phone)) newErrors.phone = 'Invalid phone format';
    if (!validateRequired(data.message, 10)) newErrors.message = 'Message must be at least 10 characters';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name !== 'botField' && touched[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (time: string) => {
    setFormData(prev => {
      const times = prev.times.includes(time) 
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time];
      return { ...prev, times };
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const validationErrors = validate(formData);
    if (validationErrors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name as keyof FormErrors] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Bot check
    if (formData.botField) {
      setIsSuccess(true);
      return;
    }

    setTouched({ name: true, email: true, phone: true, message: true });
    
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare template parameters matching standard EmailJS variable conventions.
      // Ensure your EmailJS template uses these variable names:
      // {{from_name}}, {{from_email}}, {{phone}}, {{interest}}, {{location}}, {{message}}, {{contact_method}}, {{preferred_times}}
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        reply_to: formData.email, // Allows reply directly to sender
        phone: formData.phone,
        interest: formData.interest,
        location: formData.location,
        message: formData.message,
        contact_method: formData.method,
        preferred_times: formData.times.join(', ') || 'Anytime'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setIsSuccess(true);
      setFormData({
        name: '', email: '', phone: '', method: 'Email', interest: CONTACT_DEFAULTS.INTEREST,
        location: CONTACT_DEFAULTS.LOCATION, message: '', times: [], botField: ''
      });
      setTouched({});
      setTimeout(() => setIsSuccess(false), 8000);

    } catch (error) {
      if (import.meta.env.DEV) console.error('EmailJS Error:', error);
      setSubmitError('Something went wrong. Please try calling us directly or try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const isDark = variant === 'dark';
  const labelClass = `text-sm font-bold ${isDark ? 'text-white/90' : 'text-gray-700'}`;
  const inputBase = `w-full px-4 py-3 rounded-xl outline-none focus:ring-4 transition-all`;
  
  const getInputClass = (hasError: boolean) => {
    if (isDark) {
      return `${inputBase} bg-white/10 text-white placeholder-gray-400 ${hasError ? 'border border-red-400 focus:ring-red-400/20' : 'border border-white/20 focus:border-brand focus:ring-brand/50'}`;
    }
    return `${inputBase} bg-white text-gray-900 placeholder-gray-400 ${hasError ? 'border border-red-300 focus:ring-red-100' : 'border border-gray-200 focus:border-brand focus:ring-brand/20'}`;
  };

  const selectArrowClass = `absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-white/50' : 'text-gray-400'}`;

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center py-12 text-center rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-green-50 border border-green-100'}`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
          <CheckCircle2 size={32} />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-charcoal'}`}>Message Sent!</h3>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>We'll be in touch shortly.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-6 text-brand font-bold hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="text" name="botField" value={formData.botField} onChange={handleChange} className="hidden" autoComplete="off" />

      {submitError && (
        <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-medium ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
          <AlertCircle size={18} />
          {submitError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
          <input 
            type="text" name="name"
            value={formData.name} onChange={handleChange} onBlur={handleBlur}
            className={getInputClass(!!errors.name)}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
          <input 
            type="email" name="email"
            value={formData.email} onChange={handleChange} onBlur={handleBlur}
            className={getInputClass(!!errors.email)}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
          <input 
            type="tel" name="phone"
            value={formData.phone} onChange={handleChange} onBlur={handleBlur}
            className={getInputClass(!!errors.phone)}
            placeholder="555-123-4567"
          />
          {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Preferred Method</label>
          <div className="flex gap-4 pt-2">
            {['Phone', 'Email', 'Text'].map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.method === m ? 'border-brand bg-brand' : (isDark ? 'border-gray-500 group-hover:border-brand' : 'border-gray-300 group-hover:border-brand')}`}>
                  {formData.method === m && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <input type="radio" name="method" value={m} checked={formData.method === m} onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value as any }))} className="hidden" />
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>I'm interested in</label>
          <div className="relative">
            <select 
              name="interest" value={formData.interest} onChange={handleChange}
              className={`${getInputClass(false)} appearance-none`}
            >
              <option className="text-gray-900">Buying a Home</option>
              <option className="text-gray-900">Selling a Home</option>
              <option className="text-gray-900">Investment Properties</option>
              <option className="text-gray-900">Renting</option>
              <option className="text-gray-900">General Inquiry</option>
            </select>
            <ArrowRight size={16} className={`${selectArrowClass} rotate-90`} />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Property Location</label>
          <div className="relative">
            <select 
              name="location" value={formData.location} onChange={handleChange}
              className={`${getInputClass(false)} appearance-none`}
            >
              <option className="text-gray-900">Houston, TX</option>
              <option className="text-gray-900">Galveston, TX</option>
              <option className="text-gray-900">Austin, TX</option>
              <option className="text-gray-900">Louisiana</option>
              <option className="text-gray-900">Mississippi</option>
              <option className="text-gray-900">Florida</option>
              <option className="text-gray-900">Not sure yet</option>
            </select>
            <ArrowRight size={16} className={`${selectArrowClass} rotate-90`} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Message <span className="text-red-500">*</span></label>
        <div className="relative">
          <textarea 
            name="message" rows={4}
            value={formData.message} onChange={handleChange} onBlur={handleBlur}
            className={`${getInputClass(!!errors.message)} resize-none`}
            placeholder="Tell us about your property goals..."
            maxLength={500}
          />
          <div className={`absolute bottom-3 right-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {formData.message.length}/500
          </div>
        </div>
        {errors.message && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.message}</p>}
      </div>

      <div className="space-y-3">
        <label className={labelClass}>Best time to contact</label>
        <div className="flex flex-wrap gap-3">
          {['Morning (8am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-9pm)'].map((time) => (
            <button
              type="button"
              key={time}
              onClick={() => handleCheckboxChange(time)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                formData.times.includes(time) 
                  ? 'bg-brand text-white border-brand' 
                  : isDark 
                    ? 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};