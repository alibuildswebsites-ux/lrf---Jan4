import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUserAccount, getSavedProperties } from '../../lib/firebase/firestore';
import { UserProfile, Property } from '../../types';
import { Search, Loader2, Trash2, Eye, X, Home } from 'lucide-react';

export const AdminClientList = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(lower) || 
      u.email.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const handleDelete = async (uid: string) => {
    if (window.confirm("Are you sure you want to delete this client account? This will remove all their saved properties and cannot be undone.")) {
      const result = await deleteUserAccount(uid);
      if (result.success) {
        setUsers(prev => prev.filter(u => u.uid !== uid));
        if (selectedUser?.uid === uid) setSelectedUser(null);
      } else {
        alert("Failed to delete user");
      }
    }
  };

  const handleViewDetails = async (user: UserProfile) => {
    setSelectedUser(user);
    setLoadingProps(true);
    const props = await getSavedProperties(user.uid);
    setUserProperties(props);
    setLoadingProps(false);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal">Client Management</h1>
          <p className="text-gray-500">View and manage registered users.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand" size={40}/></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-600 text-sm">Name</th>
                  <th className="px-6 py-4 font-bold text-gray-600 text-sm">Email</th>
                  <th className="px-6 py-4 font-bold text-gray-600 text-sm">Joined</th>
                  <th className="px-6 py-4 font-bold text-gray-600 text-sm text-center">Saved Props</th>
                  <th className="px-6 py-4 font-bold text-gray-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentUsers.map(user => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-brand-light text-brand-dark px-2 py-1 rounded-full text-xs font-bold">
                        {user.savedProperties?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleViewDetails(user)} className="p-2 text-gray-400 hover:text-brand bg-gray-50 hover:bg-brand-light rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDelete(user.uid)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-gray-500">Page {currentPage} of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-charcoal">Client Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-charcoal"><X size={24}/></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                  <p className="font-bold text-charcoal">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                  <p className="font-bold text-charcoal">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Joined</label>
                  <p className="font-bold text-charcoal">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Saved Count</label>
                  <p className="font-bold text-brand">{selectedUser.savedProperties?.length || 0}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-charcoal mb-4">Saved Properties</h4>
                {loadingProps ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand"/></div>
                ) : userProperties.length === 0 ? (
                  <p className="text-gray-500 text-sm">No saved properties.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userProperties.map(p => (
                      <div key={p.id} className="flex gap-3 p-3 border border-gray-100 rounded-xl hover:border-brand/30 transition-colors">
                        <img src={p.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                        <div className="min-w-0">
                          <h5 className="font-bold text-sm truncate">{p.title}</h5>
                          <p className="text-xs text-gray-500 truncate">{p.address}</p>
                          <a href={`#/property-listings/${p.id}`} target="_blank" className="text-xs text-brand hover:underline flex items-center gap-1 mt-1">
                            View Listing <Home size={10}/>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
               <span className="text-xs text-gray-400">User ID: {selectedUser.uid}</span>
               <button 
                 onClick={() => handleDelete(selectedUser.uid)}
                 className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50"
               >
                 Delete Account
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};