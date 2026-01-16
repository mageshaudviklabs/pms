import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Card from '../components/Card';

const EmployeeDashboard = () => {
  const productivityData = [
    { day: 'Mon', tasks: 4 },
    { day: 'Tue', tasks: 3 },
    { day: 'Wed', tasks: 5 },
    { day: 'Thu', tasks: 2 },
    { day: 'Fri', tasks: 4 }
  ];

  const skillGrowth = [
    { month: 'Jan', score: 60 },
    { month: 'Feb', score: 65 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 85 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary to-primaryDark p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Harsha!</h2>
          <p className="opacity-80">You have 4 tasks to complete today. Let&apos;s make it productive!</p>
          <div className="mt-6 flex gap-3">
            <button className="bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all">
              Log Hours
            </button>
            <button className="bg-primaryDark/50 border border-white/20 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primaryDark/70 transition-all">
              View Roadmap
            </button>
          </div>
        </div>
        <i className="fa-solid fa-rocket absolute -right-8 -bottom-8 text-white/10 text-9xl -rotate-12"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Current Work">
            <div className="space-y-4">
              {[
                { title: 'Refactor Auth Service', project: 'ElitePMS Core', priority: 'High', github: 'PR #204' },
                { title: 'Design Review System', project: 'ElitePMS UI', priority: 'Medium', github: 'PR #198' },
                { title: 'Excel Parser Optimization', project: 'Back-office Tools', priority: 'Medium', github: 'Issue #42' }
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-borderDiv rounded-xl hover:bg-sidebarBg transition-colors group">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white border border-borderDiv rounded-lg flex items-center justify-center text-textSecondary group-hover:text-primary transition-colors">
                      <i className="fa-solid fa-code"></i>
                    </div>
                    <div>
                      <p className="font-bold text-textPrimary leading-tight">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-textSecondary">{task.project}</span>
                        <span className="text-[10px] text-primary font-bold">· {task.github}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${task.priority === 'High' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>
                      {task.priority}
                    </span>
                    <button className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-textSecondary">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Productivity (Tasks Done)">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: '#F4F2FB' }} contentStyle={{ borderRadius: '8px', border: '1px solid #DAD5EC' }} />
                    <Bar dataKey="tasks" fill="#8E7CC3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Performance Insight">
              <p className="text-xs text-textSecondary mb-4">Refreshed every 24 hours</p>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-sidebarBg" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * 0.15} className="text-primary" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-textPrimary">8.5</span>
                    <span className="text-[10px] text-textSecondary font-bold uppercase">Score</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-textPrimary mt-2">Elite Performer</p>
              <p className="text-center text-[10px] text-textSecondary italic mt-1">&quot;Excellent consistency in Sprint 42&quot;</p>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card title="Reviews & Growth">
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-primary/20">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                <p className="text-xs font-bold text-textSecondary uppercase mb-1">Q2 Peer Review</p>
                <p className="text-sm font-bold text-textPrimary">2 Pending to give</p>
                <button className="mt-2 text-primary text-xs font-bold hover:underline">Start Now</button>
              </div>
              <div className="relative pl-6 border-l-2 border-primary/20">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sidebarBg border-4 border-white"></div>
                <p className="text-xs font-bold text-textSecondary uppercase mb-1">Manager Feedback</p>
                <p className="text-sm font-bold text-textPrimary">Awaiting Finalization</p>
              </div>
            </div>
          </Card>

          <Card title="Skill Growth">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={skillGrowth}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8E7CC3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8E7CC3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #DAD5EC' }} />
                  <Area type="monotone" dataKey="score" stroke="#8E7CC3" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;