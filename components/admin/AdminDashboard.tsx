
import React, { useEffect, useState } from 'react';
import { getProperties, deleteProperty } from '../../lib/firebase/firestore';
import { Property, BlogPost, Agent } from '../../types';
import { Plus, Edit2, Trash2, Search, LayoutGrid, FileText, Users, BarChart3, MessageSquare } from 'lucide-react';
import { AdminPropertyForm } from './AdminPropertyForm';
import { AdminBlogList } from './AdminBlogList';
import { AdminBlogForm } from './AdminBlogForm';
import { AdminAgentList } from './AdminAgentList';
import { AdminAgentForm } from './AdminAgentForm';
import { AdminOverview } from './AdminOverview';
import { AdminClientList } from './AdminClientList';
import { AdminTestimonialList } from './AdminTestimonialList';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'blogs' | 'agents' | 'clients' | 'testimonials'>('overview');
  
  // Property State
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  // Blog State
  const [blogViewMode, setBlogViewMode] = useState<'list' | 'form'>('list');
  const [editingBlog, setEditingBlog] = useState<BlogPost | undefined>(undefined);

  // Agent State
  const [agentViewMode, setAgentViewMode] = useState<'list' | 'form'>('list');
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>(undefined);

  const fetchProperties = async () => {
    setLoadingProps(true);
    const data = await getProperties();
    setProperties(data as Property[]);
    setLoadingProps(false);
  };

  useEffect(() => {
    if (activeTab === 'properties') fetchProperties();
  }, [activeTab]);

  // Property Handlers
  const handleAddNewProp = () => { setEditingProperty(undefined); setViewMode('form'); };
  const handleEditProp = (p: Property) => { setEditingProperty(p); setViewMode('form'); };
  const handlePropSuccess = () => { setViewMode('list'); fetchProperties(); };
  const handleDeleteProp = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  // Blog Handlers
  const handleAddNewBlog = () => { setEditingBlog(undefined); setBlogViewMode('form'); };
  const handleEditBlog = (b: BlogPost) => { setEditingBlog(b); setBlogViewMode('form'); };
  const handleBlogSuccess = () => { setBlogViewMode('list'); };

  // Agent Handlers
  const handleAddNewAgent = () => { setEditingAgent(undefined); setAgentViewMode('form'); };
  const handleEditAgent = (a: Agent) => { setEditingAgent(a); setAgentViewMode('form'); };
  const handleAgentSuccess = () => { setAgentViewMode('list'); };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Top Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto no-scrollbar pb-1">
        <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <BarChart3 size={18} /> Overview
        </button>
        <button onClick={() => setActiveTab('properties')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'properties' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <LayoutGrid size={18} /> Properties
        </button>
        <button onClick={() => setActiveTab('clients')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'clients' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <Users size={18} /> Clients
        </button>
        <button onClick={() => setActiveTab('blogs')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'blogs' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <FileText size={18} /> Blog
        </button>
        <button onClick={() => setActiveTab('agents')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'agents' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <Users size={18} /> Agents
        </button>
        <button onClick={() => setActiveTab('testimonials')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'testimonials' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <MessageSquare size={18} /> Testimonials
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'overview' && <AdminOverview />}
      
      {activeTab === 'clients' && <AdminClientList />}

      {activeTab === 'testimonials' && <AdminTestimonialList />}

      {activeTab === 'properties' && (
        viewMode === 'form' ? (
          <div className="max-w-4xl mx-auto">
            <AdminPropertyForm 
              initialData={editingProperty} 
              onSuccess={handlePropSuccess} 
              onCancel={() => setViewMode('list')} 
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-charcoal">Property Listings</h2>
              <button 
                onClick={handleAddNewProp}
                className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg shadow-brand/20"
              >
                <Plus size={20} /> Add Property
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search properties..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {loadingProps ? (
              <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-500">No properties found.</div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm">Property</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm">Status</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm">Views</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm">Price</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProperties.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              {p.images[0] && <img src={p.images[0]} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <div className="font-bold text-charcoal">{p.title}</div>
                              <div className="text-xs text-gray-500">{p.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600">
                          {p.views || 0}
                        </td>
                        <td className="px-6 py-4 font-bold">${p.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditProp(p)} className="p-2 text-gray-400 hover:text-brand"><Edit2 size={18}/></button>
                            <button onClick={() => handleDeleteProp(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      )}

      {activeTab === 'blogs' && (
        blogViewMode === 'form' ? (
          <div className="max-w-5xl mx-auto">
            <AdminBlogForm 
              initialData={editingBlog} 
              onSuccess={handleBlogSuccess} 
              onCancel={() => setBlogViewMode('list')} 
            />
          </div>
        ) : (
          <AdminBlogList onEdit={handleEditBlog} onAddNew={handleAddNewBlog} />
        )
      )}

      {activeTab === 'agents' && (
        agentViewMode === 'form' ? (
          <AdminAgentForm 
            initialData={editingAgent} 
            onSuccess={handleAgentSuccess} 
            onCancel={() => setAgentViewMode('list')} 
          />
        ) : (
          <AdminAgentList onEdit={handleEditAgent} onAddNew={handleAddNewAgent} />
        )
      )}

    </div>
  );
};
