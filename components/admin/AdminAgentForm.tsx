import React, { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { X, Upload, Save, Loader2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { addAgent, updateAgent, uploadFiles } from '../../lib/firebase/firestore';

interface AdminAgentFormProps {
  initialData?: Agent;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAgentForm: React.FC<AdminAgentFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Agent, 'id' | 'order' | 'createdAt' | 'updatedAt'>>({
    name: '',
    photo: '',
    bio: '',
    phone: '',
    email: '',
    yearsOfExperience: 0,
    licenseNumber: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { id, order, createdAt, updatedAt, ...rest } = initialData;
      // Ensure socialLinks exists
      const socialLinks = rest.socialLinks || { facebook: '', instagram: '', linkedin: '' };
      setFormData({ ...rest, socialLinks });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '') as keyof typeof formData.socialLinks;
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert("Only JPG and PNG files are allowed");
        return;
      }

      setUploadingImage(true);
      try {
        const paths = await uploadFiles([file], 'agents');
        setFormData(prev => ({ ...prev, photo: paths[0] }));
      } catch (error: any) {
        console.error("Image upload failed", error);
        alert(`Failed to upload image: ${error.message}. Ensure Cloudinary is configured.`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (initialData) {
        result = await updateAgent(initialData.id, formData);
      } else {
        result = await addAgent(formData);
      }

      if (result.success) {
        onSuccess();
      } else {
        alert("Error saving agent: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-gray-500 hover:text-charcoal"><ArrowLeft size={20} /></button>
          <h2 className="text-lg font-bold text-charcoal">{initialData ? 'Edit Agent' : 'New Agent'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Photo Upload */}
        <div className="flex flex-col items-center justify-center mb-6">
           <div className="relative group w-32 h-32 mb-4">
             <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50">
               {formData.photo ? (
                 <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400">
                   <ImageIcon size={32} />
                 </div>
               )}
             </div>
             <label className="absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full cursor-pointer hover:bg-brand-dark transition-colors shadow-sm">
                <Upload size={16} />
                <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} className="hidden" />
             </label>
             {uploadingImage && (
               <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                 <Loader2 className="animate-spin text-brand" />
               </div>
             )}
           </div>
           <p className="text-xs text-gray-500">JPG or PNG, Max 5MB</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none"
              placeholder="e.g. Sarah Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">License Number</label>
            <input 
              name="licenseNumber" 
              value={formData.licenseNumber} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none"
              placeholder="e.g. TX-123456"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email"
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input 
              type="tel"
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none"
              placeholder="e.g. (713) 555-0123"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
           <input 
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none"
           />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">Bio (Max 500 chars)</label>
           <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none resize-none"
              placeholder="Tell us about the agent..."
           />
           <div className="text-right text-xs text-gray-400 mt-1">
             {formData.bio.length}/500
           </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
           <h3 className="text-sm font-bold text-gray-900 mb-4">Social Media Links (Optional)</h3>
           <div className="space-y-3">
             <input 
                name="social_facebook"
                value={formData.socialLinks.facebook}
                onChange={handleChange}
                placeholder="Facebook URL"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
             />
             <input 
                name="social_instagram"
                value={formData.socialLinks.instagram}
                onChange={handleChange}
                placeholder="Instagram URL"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
             />
             <input 
                name="social_linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
             />
           </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
           <button 
             type="button" 
             onClick={onCancel}
             className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
           >
             Cancel
           </button>
           <button 
             type="submit" 
             disabled={loading}
             className="px-6 py-2.5 rounded-xl font-bold bg-brand text-white hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg shadow-brand/20"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
             Save Agent
           </button>
        </div>

      </form>
    </div>
  );
};