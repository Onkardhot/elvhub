'use client';

import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Users,
  Bot,
  Download,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    title: 'CCTV Calculator',
    description: 'Calculate camera placement',
    icon: Calculator,
    href: '/tools/cctv-calculator',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Community',
    description: 'View discussions',
    icon: Users,
    href: '/community',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'AI Assistant',
    description: 'Get solutions',
    icon: Bot,
    href: '/ai-assistant',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Downloads',
    description: 'Access resources',
    icon: Download,
    href: '/downloads',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

const recentActivity = [
  {
    type: 'post',
    title: 'Best practices for CCTV camera positioning in corridors',
    author: 'Ahmed Hassan',
    time: '2 hours ago',
    replies: 12,
  },
  {
    type: 'question',
    title: 'How to integrate access control with fire alarm system?',
    author: 'Sarah Chen',
    time: '4 hours ago',
    replies: 8,
  },
  {
    type: 'download',
    title: 'BOQ Template for Office Building - Updated 2026',
    author: 'ELVHub Team',
    time: '1 day ago',
    replies: 0,
  },
];

const stats = [
  { label: 'Total Calculations', value: '847', change: '+12%', icon: Calculator },
  { label: 'Community Posts', value: '156', change: '+8%', icon: MessageSquare },
  { label: 'Downloads', value: '423', change: '+25%', icon: Download },
  { label: 'AI Queries', value: '1,284', change: '+18%', icon: Bot },
];

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Engineer!</h2>
          <p className="text-slate-400">
            Your hub for ELV & BMS tools, community insights, and AI-powered assistance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.icon === Calculator ? 'bg-blue-500/10' : stat.icon === Users ? 'bg-green-500/10' : stat.icon === Download ? 'bg-orange-500/10' : 'bg-purple-500/10'}`}>
                      <Icon className={`w-5 h-5 ${stat.icon === Calculator ? 'text-blue-500' : stat.icon === Users ? 'text-green-500' : stat.icon === Download ? 'text-orange-500' : 'text-purple-500'}`} />
                    </div>
                    <span className="flex items-center text-xs text-green-500">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/30 transition-colors cursor-pointer group h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className={`p-3 rounded-xl ${action.bgColor} mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                    <p className="text-sm text-slate-400">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-slate-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <div className="p-2 rounded-lg bg-slate-700">
                    {item.type === 'post' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                    {item.type === 'question' && <Users className="w-4 h-4 text-green-500" />}
                    {item.type === 'download' && <Download className="w-4 h-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      by {item.author} • {item.time}
                    </p>
                  </div>
                  {item.replies > 0 && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MessageSquare className="w-3 h-3" />
                      {item.replies}
                    </div>
                  )}
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Tags */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Popular Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['CCTV', 'Access Control', 'Fire Alarm', 'BMS', 'Networking', 'Fiber Optic', 'Public Address', 'UPS'].map((tag) => (
                <Badge key={tag} variant="outline" className="border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400 cursor-pointer transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}