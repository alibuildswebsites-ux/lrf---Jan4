import React, { useEffect, useState } from 'react';
import { getAgents, deleteAgent, updateAgentOrder } from '../../lib/firebase/firestore';
import { Agent } from '../../types';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Save } from 'lucide-react';
import { Reorder } from 'framer-motion';

interface AdminAgentListProps {
  onEdit: (agent: Agent) => void;
  onAddNew: () => void;
}

export const AdminAgentList: React.FC<AdminAgentListProps> = ({ onEdit, onAddNew }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    const data = await getAgents();
    setAgents(data as Agent[]); // getAgents already sorts by 'order'
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      const result = await deleteAgent(id);
      if (result.success) {
        setAgents(prev => prev.filter(a => a.id !== id));
      } else {
        alert("Failed to delete agent");
      }
    }
  };

  const handleReorder = (newOrder: Agent[]) => {
    setAgents(newOrder);
    setHasOrderChanged(true);
  };

  const saveOrder = async () => {
    setIsSavingOrder(true);
    const result = await updateAgentOrder(agents);
    if (result.success) {
      setHasOrderChanged(false);
    } else {
      alert("Failed to save order");
    }
    setIsSavingOrder(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal tracking-tight">Team Management</h1>
          <p className="text-gray-500">Manage agent profiles and display order.</p>
        </div>
        <div className="flex gap-2">
          {hasOrderChanged && (
            <button 
              onClick={saveOrder}
              disabled={isSavingOrder}
              className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
            >
              {isSavingOrder ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
              Save Order
            </button>
          )}
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
          >
            <Plus size={20} /> Add Agent
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm">
        <strong>Tip:</strong> Drag and drop the rows to reorder how agents appear on the public website. Don't forget to click "Save Order" when done.
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-brand" size={40} />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
           <p className="text-gray-500 font-medium">No agents found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                   <th className="w-12 px-4 py-4"></th>
                   <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Agent</th>
                   <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Experience</th>
                   <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Contact</th>
                   <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <Reorder.Group as="tbody" axis="y" values={agents} onReorder={handleReorder} className="divide-y divide-gray-100">
                 {agents.map(agent => (
                   <Reorder.Item key={agent.id} value={agent} as="tr" className="hover:bg-gray-50 transition-colors bg-white relative">
                     <td className="px-4 py-4 text-gray-400 cursor-grab active:cursor-grabbing">
                       <GripVertical size={20} />
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                           {agent.photo ? (
                             <img src={agent.photo} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                           )}
                         </div>
                         <div>
                           <h4 className="font-bold text-charcoal">{agent.name}</h4>
                           <p className="text-xs text-gray-500">{agent.licenseNumber}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {agent.yearsOfExperience} Years
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-500">
                        <div>{agent.email}</div>
                        <div>{agent.phone}</div>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => onEdit(agent)}
                           className="p-2 text-gray-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all"
                         >
                           <Pencil size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete(agent.id, agent.name)}
                           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                     </td>
                   </Reorder.Item>
                 ))}
               </Reorder.Group>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};