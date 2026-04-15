'use client';

import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Thermometer,
  Wind,
  Cpu,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Settings,
  Gauge,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const systemStats = [
  { label: 'Total Systems', value: '24', status: 'online', icon: Cpu },
  { label: 'Active Alarms', value: '3', status: 'warning', icon: AlertTriangle },
  { label: 'Avg Efficiency', value: '87%', status: 'good', icon: TrendingUp },
  { label: 'Energy Savings', value: '12%', status: 'good', icon: Gauge },
];

const subsystems = [
  {
    title: 'Air Handling Unit (AHU)',
    href: '/bms/ahu',
    description: 'Central air ventilation and climate control',
    icon: Wind,
    stats: { units: '8', status: 'All Online' },
    color: 'blue',
  },
  {
    title: 'Chiller',
    href: '/bms/chiller',
    description: 'Central cooling plant management',
    icon: Thermometer,
    stats: { units: '4', status: '3 Active' },
    color: 'cyan',
  },
  {
    title: 'Fan Coil Unit (FCU)',
    href: '/bms/fcu',
    description: 'Zone-level temperature control',
    icon: Activity,
    stats: { units: '48', status: '46 Online' },
    color: 'green',
  },
  {
    title: 'Troubleshooting',
    href: '/bms/troubleshoot',
    description: 'Diagnostic tools and fault resolution',
    icon: AlertTriangle,
    stats: { units: 'Tools', status: '6 Available' },
    color: 'orange',
  },
];

const recentAlarms = [
  { time: '2 min ago', system: 'AHU-03', message: 'Filter pressure differential high', severity: 'warning' },
  { time: '15 min ago', system: 'CH-01', message: 'Condenser water temperature high', severity: 'warning' },
  { time: '1 hour ago', system: 'FCU-12', message: 'Fan motor current anomaly', severity: 'info' },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-500' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: 'text-cyan-500' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: 'text-green-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: 'text-orange-500' },
  };
  return colors[color] || colors.blue;
};

export default function BMSPage() {
  return (
    <DashboardLayout title="BMS Overview">
      <div className="space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.status === 'good' ? 'bg-green-500/10' : stat.status === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10'}`}>
                      <Icon className={`w-5 h-5 ${stat.status === 'good' ? 'text-green-500' : stat.status === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />
                    </div>
                    <Badge className={stat.status === 'good' ? 'bg-green-600' : stat.status === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'}>
                      {stat.status}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* BMS Subsystems */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">BMS Subsystems</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subsystems.map((sub) => {
              const Icon = sub.icon;
              const colorClasses = getColorClasses(sub.color);
              return (
                <Link key={sub.title} href={sub.href}>
                  <Card className={cn('bg-slate-900/50 border-slate-800 hover:border-blue-500/30 transition-colors cursor-pointer h-full', colorClasses.border)}>
                    <CardContent className="p-5">
                      <div className={cn('p-3 rounded-lg w-fit mb-4', colorClasses.bg)}>
                        <Icon className={cn('w-6 h-6', colorClasses.icon)} />
                      </div>
                      <h3 className="font-semibold text-white mb-1">{sub.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{sub.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-500">{sub.stats.units} units</span>
                          <p className="text-sm text-slate-300">{sub.stats.status}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Alarms & Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Alarms */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Recent Alarms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlarms.map((alarm, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                    <div className={cn('w-2 h-2 rounded-full mt-2', alarm.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500')} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                          {alarm.system}
                        </Badge>
                        <span className="text-xs text-slate-500">{alarm.time}</span>
                      </div>
                      <p className="text-sm text-slate-300">{alarm.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/bms/ahu" className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                  <Wind className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-white">AHU Control</p>
                  <p className="text-xs text-slate-400">Manage air handling</p>
                </Link>
                <Link href="/bms/troubleshoot" className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mb-2" />
                  <p className="text-sm font-medium text-white">Diagnostics</p>
                  <p className="text-xs text-slate-400">Troubleshoot issues</p>
                </Link>
                <Link href="/bms/fcu" className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors">
                  <Activity className="w-5 h-5 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-white">FCU Settings</p>
                  <p className="text-xs text-slate-400">Zone control</p>
                </Link>
                <Link href="/bms/chiller" className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                  <Thermometer className="w-5 h-5 text-cyan-500 mb-2" />
                  <p className="text-sm font-medium text-white">Chiller Plant</p>
                  <p className="text-xs text-slate-400">Cooling management</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}