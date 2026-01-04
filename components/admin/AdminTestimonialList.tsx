import React, { useEffect, useState } from 'react';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, updateTestimonialOrder } from '../../lib/firebase/firestore';
import { Testimonial } from '../../types';
import { Plus, Pencil, Trash2, GripVertical, Save, Loader2, X } from 'lucide-react';
import { Reorder } from 'framer-motion';

export const AdminTestimonialList = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ quote: '', author: '', role: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (t: Testimonial) => {
    setFormData({ quote: t.quote, author: t.author, role: t.role });
    setEditingId(t.id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({ quote: '', author: '', role: '' });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (editingId) {
      await updateTestimonial(editingId, formData);
    } else {
      await addTestimonial(formData);
    }
    await fetchTestimonials();
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this testimonial?")) {
      await deleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleReorder = (newOrder: Testimonial[]) => {
    setTestimonials(newOrder);
    setHasOrderChanged(true);
  };

  const saveOrder = async () => {
    setIsSaving(true);
    await updateTestimonialOrder(testimonials);
    setHasOrderChanged(false);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal">Testimonials</h1>
          <p className="text-gray-500">Manage client reviews and display order.</p>
        </div>
        <div className="flex gap-2">
          {hasOrderChanged && (
            <button 
              onClick={saveOrder}
              disabled={isSaving}
              className="bg-charcoal text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save Order
            </button>
          )}
          <button 
            onClick={handleAddNew}
            className="bg-brand text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand/20 hover:bg-brand-dark"
          >
            <Plus size={20}/> Add New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand" size={40}/></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-4"></th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">Quote</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">Author</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <Reorder.Group as="tbody" axis="y" values={testimonials} onReorder={handleReorder} className="divide-y divide-gray-100">
              {testimonials.map(t => (
                <Reorder.Item key={t.id} value={t} as="tr" className="hover:bg-gray-50 bg-white">
                  <td className="px-4 py-4 text-gray-400 cursor-grab active:cursor-grabbing"><GripVertical size={20}/></td>
                  <td className="px-6 py-4 text-sm text-gray-600 italic line-clamp-2 max-w-md">"{t.quote}"</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-charcoal">{t.author}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(t)} className="p-2 text-gray-400 hover:text-brand"><Pencil size={18}/></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-charcoal">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <button onClick={() => setIsEditing(false)}><X size={24} className="text-gray-400"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Quote</label>
                <textarea 
                  required
                  rows={4}
                  maxLength={300}
                  value={formData.quote}
                  onChange={e => setFormData({...formData, quote: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                  placeholder="Enter client testimonial..."
                />
                <div className="text-right text-xs text-gray-400">{formData.quote.length}/300</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Author Name</label>
                  <input 
                    required
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                  <input 
                    required
                    placeholder="e.g. Buyer"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-brand text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-brand-dark transition-colors"
              >
                {isSaving ? <Loader2 className="animate-spin"/> : 'Save Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};