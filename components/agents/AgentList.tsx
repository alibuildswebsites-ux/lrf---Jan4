
import React, { useEffect, useState } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { Agent } from '../../types';
import { getAgents } from '../../lib/firebase/firestore';
import { AgentCard } from './AgentCard';
import { Search } from 'lucide-react';
import { updateSEO } from '../../utils';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AgentList = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateSEO({
      title: "Meet Our Real Estate Agents | Lofton Realty Team",
      description: "Get to know the experienced real estate professionals at Lofton Realty. Our team is dedicated to helping you buy or sell your home in Houston.",
      url: "https://loftonrealty.com/agents"
    });

    const fetchAgents = async () => {
      setLoading(true);
      const data = await getAgents();
      setAgents(data);
      setLoading(false);
    };

    fetchAgents();
  }, []);

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      <div className="bg-white border-b border-gray-200 pt-32 pb-12">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 text-center">
          <span className="text-brand font-bold tracking-widest uppercase text-sm mb-3 block">Our Experts</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-charcoal mb-6 tracking-tight">
            Meet The Team
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Dedicated professionals committed to your real estate success.
          </p>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-5 md:px-10 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-charcoal mb-2">No agents found</h3>
            <p className="text-gray-500">Check back soon to meet our growing team.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
