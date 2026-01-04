import React from 'react';
import { Agent } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full">
      <div className="p-6 flex flex-col items-center text-center flex-grow">
        <div className="w-32 h-32 rounded-full mb-6 relative group-hover:scale-105 transition-transform duration-300">
          <img 
            src={getOptimizedImageUrl(agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a', 400)} 
            alt={agent.name}
            className="w-full h-full object-cover rounded-full border-4 border-gray-50 shadow-md"
          />
          <div className="absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full shadow-lg border-2 border-white">
            <Award size={16} />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-charcoal mb-1">{agent.name}</h3>
        <p className="text-brand font-bold text-sm uppercase tracking-wide mb-4">{agent.yearsOfExperience} Years Experience</p>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 px-2">
          {agent.bio}
        </p>
        
        <div className="mt-auto pt-6 border-t border-gray-50 w-full">
          <Link 
            to={`/agents/${agent.id}`}
            className="w-full py-2 flex items-center justify-center gap-2 text-charcoal font-bold hover:text-brand transition-colors group/link"
          >
            View Profile <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};