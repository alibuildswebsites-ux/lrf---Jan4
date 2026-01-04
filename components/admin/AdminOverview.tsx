import React, { useEffect, useState } from 'react';
import { Home, Users, FileText, Briefcase, Eye } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { getProperties, getBlogs, getAgents, getAllUsers } from '../../lib/firebase/firestore';
import { Property, BlogPost, UserProfile, Agent } from '../../types';

export const AdminOverview = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [pData, bData, uData, aData] = await Promise.all([
        getProperties(),
        getBlogs(false),
        getAllUsers(),
        getAgents()
      ]);
      setProperties(pData as Property[]);
      setBlogs(bData);
      setUsers(uData);
      setAgents(aData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- Derived Stats ---
  const stats = [
    { label: 'Total Properties', value: properties.length, icon: Home, color: 'bg-blue-100 text-blue-600' },
    { label: 'Registered Clients', value: users.length, icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Blog Posts', value: blogs.length, icon: FileText, color: 'bg-green-100 text-green-600' },
    { label: 'Active Agents', value: agents.length, icon: Briefcase, color: 'bg-orange-100 text-orange-600' },
  ];

  // --- Chart Data Preparation ---
  
  // 1. Properties over time (simulated by month for demo, usually would use createdAt real aggregation)
  const propChartData = properties.reduce((acc: any[], curr) => {
    if (!curr.createdAt) return acc;
    const date = new Date(curr.createdAt);
    const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
    const existing = acc.find(i => i.name === key);
    if (existing) existing.count++;
    else acc.push({ name: key, count: 1 });
    return acc;
  }, []).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  // 2. Blogs by Category
  const blogChartData = blogs.reduce((acc: any[], curr) => {
    const existing = acc.find(i => i.name === curr.category);
    if (existing) existing.count++;
    else acc.push({ name: curr.category, count: 1 });
    return acc;
  }, []);

  // 3. User Growth (cumulative)
  const userChartData = users
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((u, i) => ({
      name: new Date(u.createdAt).toLocaleDateString(),
      total: i + 1
    }));

  // --- Recent Activity ---
  const activityFeed = [
    ...properties.map(p => ({ type: 'property', msg: `Added property: ${p.title}`, date: p.createdAt })),
    ...blogs.map(b => ({ type: 'blog', msg: `Published blog: ${b.title}`, date: b.createdAt })),
    ...users.map(u => ({ type: 'user', msg: `New client: ${u.name}`, date: u.createdAt }))
  ].sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime()).slice(0, 20);

  // --- Top Viewed ---
  const topViewed = [...properties].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-charcoal">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Charts Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* User Growth */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-charcoal mb-6">Client Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userChartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#16A34A" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* Property Adds */}
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-charcoal mb-6">Properties Added</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={propChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                      <XAxis dataKey="name" fontSize={10} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Blog Categories */}
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-charcoal mb-6">Content Mix</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={blogChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                      <XAxis dataKey="name" hide />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>

        </div>

        {/* Sidebar Column (1/3) */}
        <div className="space-y-8">
          
          {/* Top Viewed */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-charcoal mb-4">Most Viewed Properties</h3>
            <div className="space-y-4">
              {topViewed.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-charcoal truncate">{p.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{p.address}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    <Eye size={12} /> {p.views || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-h-[400px] overflow-y-auto">
            <h3 className="font-bold text-charcoal mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activityFeed.map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    item.type === 'property' ? 'bg-blue-500' :
                    item.type === 'blog' ? 'bg-purple-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-gray-800">{item.msg}</p>
                    <p className="text-xs text-gray-400">
                      {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};