import React, { useState, useEffect } from 'react';
import { BlogPost } from '../../types';
import { X, Upload, Save, Loader2, Image as ImageIcon, Eye, ArrowLeft, Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo, Code } from 'lucide-react';
import { addBlog, updateBlog, uploadFiles } from '../../lib/firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { sanitizeHtml } from '../../lib/sanitizeHtml';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface AdminBlogFormProps {
  initialData?: BlogPost;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Market Updates',
  'Buyer Tips',
  'Seller Tips',
  'Investment Advice',
  'Neighborhood Guides',
  'Home Improvement',
  'Real Estate News'
];

// --- TipTap Toolbar Component ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      icon: Bold,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: Italic,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: Strikethrough,
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      icon: Code,
      title: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
    },
    { type: 'divider' },
    {
      icon: Heading1,
      title: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: Heading2,
      title: 'H3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    { type: 'divider' },
    {
      icon: List,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    { type: 'divider' },
    {
      icon: Undo,
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/50 sticky top-0 z-10">
      {buttons.map((btn, index) => (
        btn.type === 'divider' ? (
          <div key={index} className="w-[1px] h-6 bg-gray-300 mx-2" />
        ) : (
          <button
            key={index}
            onClick={(e) => { e.preventDefault(); btn.action && btn.action(); }}
            disabled={btn.disabled}
            className={`p-2 rounded-lg transition-all ${
              btn.isActive 
                ? 'bg-brand text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-charcoal'
            } ${btn.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            title={btn.title}
            type="button"
          >
            {btn.icon && <btn.icon size={18} />}
          </button>
        )
      ))}
    </div>
  );
};

export const AdminBlogForm: React.FC<AdminBlogFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    slug: '',
    author: user?.displayName || 'Lofton Realty Team',
    category: 'Market Updates',
    tags: [],
    featuredImage: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    published: false
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Initialize TipTap
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4 text-gray-700 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Sync initial data
  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      setFormData(rest);
      // Sync editor content only if it hasn't been touched or is different
      if (editor && rest.content && editor.getHTML() !== rest.content) {
        editor.commands.setContent(rest.content);
      }
    }
  }, [initialData, editor]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingImage(true);
      try {
        const file = e.target.files[0];
        // Use Cloudinary upload
        const paths = await uploadFiles([file], 'blogs');
        setFormData(prev => ({ ...prev, featuredImage: paths[0] }));
      } catch (error: any) {
        console.error("Image upload failed", error);
        alert(`Failed to upload image: ${error.message}. Ensure Cloudinary is configured.`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent, publishStatus: boolean) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = { ...formData, published: publishStatus };
      
      let result;
      if (initialData) {
        result = await updateBlog(initialData.id, submissionData);
      } else {
        result = await addBlog(submissionData);
      }

      if (result.success) {
        onSuccess();
      } else {
        alert("Error saving blog: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (previewMode) {
    return (
      <div className="bg-white min-h-screen fixed inset-0 z-[100] overflow-y-auto">
        <div className="bg-charcoal px-6 py-4 text-white flex justify-between items-center sticky top-0 z-50">
          <h3 className="font-bold text-lg">Preview Mode</h3>
          <button onClick={() => setPreviewMode(false)} className="flex items-center gap-2 hover:text-brand">
            <X size={20} /> Close Preview
          </button>
        </div>
        <div className="max-w-3xl mx-auto py-12 px-6">
           <h1 className="text-4xl font-extrabold text-charcoal mb-4">{formData.title}</h1>
           <div className="mb-8 h-64 md:h-96 rounded-2xl overflow-hidden bg-gray-100">
             {formData.featuredImage && <img src={formData.featuredImage} className="w-full h-full object-cover" />}
           </div>
           <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(formData.content) }} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-gray-500 hover:text-charcoal"><ArrowLeft size={20} /></button>
          <h2 className="text-lg font-bold text-charcoal">{initialData ? 'Edit Post' : 'New Post'}</h2>
        </div>
        <button 
          type="button" 
          onClick={() => setPreviewMode(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Eye size={16} /> Preview
        </button>
      </div>

      <form className="p-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        
        {/* Main Content Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-lg font-medium"
              placeholder="Enter post title..."
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand focus-within:border-transparent shadow-sm">
               <MenuBar editor={editor} />
               <EditorContent editor={editor} />
             </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
             <h3 className="text-sm font-bold text-gray-900 mb-4">SEO Settings</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Meta Title</label>
                 <input 
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
                    placeholder="SEO Title (defaults to title)"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Meta Description</label>
                 <textarea 
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none resize-none"
                    placeholder="Brief description for search engines..."
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Slug URL</label>
                 <div className="flex items-center">
                   <span className="text-gray-400 text-sm mr-1">/blog/</span>
                   <input 
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
                   />
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Publish Action */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
             <div className="flex justify-between items-center text-sm text-gray-500">
               <span>Status:</span>
               <span className={`font-bold ${formData.published ? 'text-green-600' : 'text-yellow-600'}`}>
                 {formData.published ? 'Published' : 'Draft'}
               </span>
             </div>
             <div className="grid grid-cols-2 gap-2">
               <button 
                 onClick={(e) => handleSubmit(e, false)}
                 disabled={loading}
                 className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100"
               >
                 Save Draft
               </button>
               <button 
                 onClick={(e) => handleSubmit(e, true)}
                 disabled={loading}
                 className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-dark flex justify-center items-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin" size={14}/> : 'Publish'}
               </button>
             </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Featured Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-brand transition-colors bg-gray-50 relative group">
               {formData.featuredImage ? (
                 <div className="relative aspect-video rounded-lg overflow-hidden">
                   <img src={formData.featuredImage} className="w-full h-full object-cover" />
                   <button 
                     type="button"
                     onClick={() => setFormData(p => ({...p, featuredImage: ''}))}
                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <X size={14} />
                   </button>
                 </div>
               ) : (
                 <div className="py-8">
                   <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                   <p className="text-xs text-gray-500">Click to upload cover image</p>
                 </div>
               )}
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={handleImageUpload} 
                 className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${formData.featuredImage ? 'hidden' : ''}`}
               />
               {uploadingImage && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-brand"/></div>}
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Author</label>
              <input 
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    {tag} <button type="button" onClick={() => removeTag(tag)}><X size={12}/></button>
                  </span>
                ))}
              </div>
              <input 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Type tag & press Enter"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none"
              />
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};