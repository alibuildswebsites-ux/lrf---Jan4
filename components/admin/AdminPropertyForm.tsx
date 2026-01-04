import React, { useState, useEffect } from 'react';
import { Property } from '../../types';
import { X, Upload, Plus, Trash2, Eye, Save, Loader2, Video, Image as ImageIcon } from 'lucide-react';
import { addProperty, updateProperty, uploadFiles, setPropertyWithId } from '../../lib/firebase/firestore';
import { PropertyCard } from '../PropertyCard';
import { collection, doc } from 'firebase/firestore';
import { db } from '../../firebase.config';

interface AdminPropertyFormProps {
  initialData?: Property;
  onSuccess: () => void;
  onCancel: () => void;
}

const DEFAULT_FORM_STATE: Omit<Property, 'id'> = {
  title: '',
  price: 0,
  address: '',
  street: '',
  city: '',
  state: 'TX',
  zip: '',
  beds: 0,
  baths: 0,
  sqft: 0,
  status: 'For Sale',
  type: 'House',
  description: '',
  features: [],
  tags: [],
  images: [],
  videos: []
};

export const AdminPropertyForm: React.FC<AdminPropertyFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Property, 'id'>>(initialData || DEFAULT_FORM_STATE);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  // Create a pending ID for new properties to allow uploads before save (used for folder org)
  const [pendingId] = useState(() => initialData?.id || doc(collection(db, 'properties')).id);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleFeatureAdd = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const handleFeatureRemove = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleTagAdd = () => {
    if (newTag.trim()) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleTagRemove = (index: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingMedia(true);
      const files = Array.from(e.target.files) as File[];
      try {
        // Upload to Cloudinary
        // Store in a folder named after the property ID
        const uploadedPaths = await uploadFiles(files, `properties/${pendingId}`);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedPaths] }));
      } catch (error: any) {
        console.error("Image upload failed", error);
        alert(`Failed to upload images: ${error.message || "Unknown error"}. Check Cloudinary config.`);
      } finally {
        setUploadingMedia(false);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 100 * 1024 * 1024) { // 100MB check
        alert("Video size must be less than 100MB");
        return;
      }
      setUploadingMedia(true);
      try {
        const uploadedPaths = await uploadFiles([file], `properties/${pendingId}`);
        setFormData(prev => ({ ...prev, videos: [...prev.videos, ...uploadedPaths] }));
      } catch (error: any) {
        console.error("Video upload failed", error);
        alert(`Failed to upload video: ${error.message}. Check Cloudinary config.`);
      } finally {
        setUploadingMedia(false);
      }
    }
  };

  const handleMediaRemove = (type: 'images' | 'videos', index: number) => {
    setFormData(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construct full address
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;
      // Ensure sqft is number
      const submissionData = { 
        ...formData, 
        address: fullAddress,
        sqft: Number(formData.sqft) 
      };

      let result;
      if (initialData?.id) {
        result = await updateProperty(initialData.id, submissionData);
      } else {
        // Use the pending ID we generated for uploads
        result = await setPropertyWithId(pendingId, submissionData);
      }

      if (result.success) {
        onSuccess();
      } else {
        alert("Error saving property: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (showPreview) {
    const previewProp = { ...formData, id: 'preview', address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}` } as Property;
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col overflow-hidden">
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
          <h3 className="text-xl font-bold text-charcoal">Preview Mode</h3>
          <button 
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-charcoal font-medium"
          >
            <X size={20} /> Close Preview
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-100">
           <div className="max-w-md w-full">
             <PropertyCard property={previewProp} />
             <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-bold text-lg mb-4">Description</h4>
                <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: formData.description.replace(/\n/g, '<br/>') }} />
                
                <h4 className="font-bold text-lg mt-6 mb-4">Features</h4>
                <ul className="list-disc pl-5">
                    {formData.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold text-charcoal">{initialData ? 'Edit Property' : 'Add New Property'}</h2>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Eye size={16} /> Preview
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
        
        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b border-gray-100 pb-2">Basic Details</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Property Title</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                placeholder="e.g. Modern Sunset Villa"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white"
                >
                  <option>For Sale</option>
                  <option>For Rent</option>
                  <option>Sold</option>
                  <option>Rented</option>
                  <option>New Listing</option>
                  <option>Pending</option>
                  <option>Price Drop</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white"
                >
                  <option>House</option>
                  <option>Condo</option>
                  <option>Apartment</option>
                  <option>Townhouse</option>
                  <option>Land</option>
                  <option>Other</option>
                </select>
             </div>
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b border-gray-100 pb-2">Location</h3>
          
          <div className="grid gap-4">
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
               <input 
                  name="street" 
                  value={formData.street} 
                  onChange={handleChange} 
                  required
                  placeholder="123 Oak St"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
             </div>
             <div className="grid grid-cols-3 gap-4">
               <div className="col-span-1">
                 <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                 <input 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  />
               </div>
               <div className="col-span-1">
                 <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                 <input 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  />
               </div>
               <div className="col-span-1">
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Zip</label>
                 <input 
                    name="zip" 
                    value={formData.zip} 
                    onChange={handleChange} 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  />
               </div>
             </div>
          </div>
        </section>

        {/* Specs */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b border-gray-100 pb-2">Property Specs</h3>
          <div className="grid grid-cols-3 gap-4">
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Bedrooms</label>
               <input type="number" name="beds" value={formData.beds} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
             </div>
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Bathrooms</label>
               <input type="number" step="0.5" name="baths" value={formData.baths} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
             </div>
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Sq Ft</label>
               <input type="number" name="sqft" value={formData.sqft} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
             </div>
          </div>
        </section>

        {/* Description & Features */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b border-gray-100 pb-2">Details</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              rows={5} 
              value={formData.description} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none resize-none"
              placeholder="Enter detailed property description..."
            />
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Features</label>
             <div className="flex gap-2 mb-2">
               <input 
                 value={newFeature} 
                 onChange={(e) => setNewFeature(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleFeatureAdd())}
                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                 placeholder="Add a feature (e.g. Pool, Fireplace)"
               />
               <button type="button" onClick={handleFeatureAdd} className="bg-gray-100 hover:bg-gray-200 text-charcoal px-3 rounded-lg"><Plus size={20}/></button>
             </div>
             <div className="flex flex-wrap gap-2">
               {formData.features.map((f, i) => (
                 <span key={i} className="bg-brand-light text-brand-dark px-2 py-1 rounded-md text-sm flex items-center gap-1">
                   {f} <button type="button" onClick={() => handleFeatureRemove(i)}><X size={14} /></button>
                 </span>
               ))}
             </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (Check for 'New Listing')</label>
             <div className="flex gap-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <input 
                    type="checkbox" 
                    checked={formData.tags.includes('New Listing')}
                    onChange={(e) => {
                       if(e.target.checked) setFormData(p => ({...p, tags: [...p.tags, 'New Listing']}));
                       else setFormData(p => ({...p, tags: p.tags.filter(t => t !== 'New Listing')}));
                    }}
                    className="accent-brand"
                  />
                  <span className="text-sm font-medium">New Listing</span>
                </label>
             </div>
          </div>
        </section>

        {/* Media */}
        <section className="space-y-4">
           <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b border-gray-100 pb-2">Media</h3>
           
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">Images (Drag & Drop)</label>
             <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand transition-colors bg-gray-50 group cursor-pointer relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <Upload className="mx-auto text-gray-400 group-hover:text-brand mb-2" size={32} />
                  <p className="text-sm text-gray-500 font-medium">Click or Drag images here</p>
                </div>
             </div>
             
             {/* Image Previews */}
             {formData.images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                   {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 bg-gray-100">
                         <img src={img} alt="" className="w-full h-full object-cover" />
                         <button 
                            type="button" 
                            onClick={() => handleMediaRemove('images', i)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                            <X size={12} />
                         </button>
                      </div>
                   ))}
                </div>
             )}
           </div>

           <div className="mt-4">
             <label className="block text-sm font-semibold text-gray-700 mb-2">Videos (Max 100MB)</label>
             <div className="flex items-center gap-4">
               <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-charcoal px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2">
                 <Video size={18} /> Add Video
                 <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
               </label>
               {uploadingMedia && <span className="text-sm text-gray-500 flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Uploading to Cloudinary...</span>}
             </div>
             {formData.videos.length > 0 && (
               <div className="mt-2 space-y-2">
                 {formData.videos.map((vid, i) => (
                   <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-500 truncate max-w-[200px]">Video {i + 1}</span>
                      <button type="button" onClick={() => handleMediaRemove('videos', i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </section>

      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
         <button 
           type="button" 
           onClick={onCancel}
           className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
         >
           Cancel
         </button>
         <button 
           type="submit" 
           disabled={loading || uploadingMedia}
           className="px-6 py-2.5 rounded-xl font-bold bg-brand text-white hover:bg-brand-dark transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
         >
           {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
           {loading ? 'Saving...' : 'Save Property'}
         </button>
      </div>
    </form>
  );
};