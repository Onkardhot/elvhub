'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Thermometer,
  Fan,
  Droplets,
  Settings,
  Power,
  Search,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockFCUs = [
  { id: 'FCU-01', zone: 'Lobby', temp: 22.5, setpoint: 23, fanSpeed: 60, status: 'running' },
  { id: 'FCU-02', zone: 'Reception', temp: 21.8, setpoint: 22, fanSpeed: 45, status: 'running' },
  { id: 'FCU-03', zone: 'Office A1', temp: 23.1, setpoint: 22, fanSpeed: 80, status: 'cooling' },
  { id: 'FCU-04', zone: 'Office A2', temp: 22.8, setpoint: 22, fanSpeed: 70, status: 'running' },
  { id: 'FCU-05', zone: 'Office B1', temp: 24.2, setpoint: 23, fanSpeed: 100, status: 'heating' },
  { id: 'FCU-06', zone: 'Meeting Room 1', temp: 22.0, setpoint: 22, fanSpeed: 0, status: 'off' },
  { id: 'FCU-07', zone: 'Server Room', temp: 18.5, setpoint: 18, fanSpeed: 85, status: 'cooling' },
  { id: 'FCU-08', zone: 'Kitchen', temp: 25.1, setpoint: 24, fanSpeed: 50, status: 'cooling' },
];

const statusColors: Record<string, string> = {
  running: 'bg-green-600',
  cooling: 'bg-blue-600',
  heating: 'bg-orange-600',
  off: 'bg-slate-600',
};

const modeOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'cooling', label: 'Cooling Only' },
  { value: 'heating', label: 'Heating Only' },
  { value: 'fan', label: 'Fan Only' },
  { value: 'off', label: 'Off' },
];

export default function FCUPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFCU, setSelectedFCU] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);

  const filteredFCUs = mockFCUs.filter((fcu) =>
    fcu.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fcu.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Fan Coil Units">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Fan Coil Units (FCU)</h2>
            <p className="text-slate-400 text-sm">Zone-level temperature control management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync All
            </Button>
            <Button variant="outline" className="border-slate-700" onClick={() => setShowControls(!showControls)}>
              <Settings className="w-4 h-4 mr-2" />
              Global Settings
            </Button>
          </div>
        </div>

        {/* Global Controls */}
        {showControls && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Global Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Default Mode</label>
                  <Select options={modeOptions} value="auto" onChange={() => {}} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Default Setpoint</label>
                  <div className="flex items-center gap-2">
                    <Input type="number" value="22" className="w-20" />
                    <span className="text-slate-400">°C</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Night Setback</label>
                  <div className="flex items-center gap-2">
                    <Input type="number" value="25" className="w-20" />
                    <span className="text-slate-400">°C (heating)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Energy Saving</label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-slate-300">Enable auto-off when window open</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by ID or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
            <p className="text-2xl font-bold text-white">{mockFCUs.length}</p>
            <p className="text-xs text-slate-400">Total Units</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
            <p className="text-2xl font-bold text-green-400">{mockFCUs.filter((f) => f.status === 'running' || f.status === 'cooling' || f.status === 'heating').length}</p>
            <p className="text-xs text-slate-400">Active</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
            <p className="text-2xl font-bold text-blue-400">{mockFCUs.filter((f) => f.status === 'cooling').length}</p>
            <p className="text-xs text-slate-400">Cooling</p>
          </div>
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
            <p className="text-2xl font-bold text-orange-400">{mockFCUs.filter((f) => f.status === 'heating').length}</p>
            <p className="text-xs text-slate-400">Heating</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
            <p className="text-2xl font-bold text-slate-400">{mockFCUs.filter((f) => f.status === 'off').length}</p>
            <p className="text-xs text-slate-400">Off</p>
          </div>
        </div>

        {/* FCU Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFCUs.map((fcu) => (
            <Card
              key={fcu.id}
              className={cn(
                'bg-slate-900/50 border-slate-800 cursor-pointer transition-all hover:border-blue-500/30',
                selectedFCU === fcu.id && 'border-blue-500/50 bg-blue-500/5'
              )}
              onClick={() => setSelectedFCU(selectedFCU === fcu.id ? null : fcu.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={statusColors[fcu.status]}>{fcu.status}</Badge>
                  <span className="text-xs text-slate-500">{fcu.id}</span>
                </div>

                <h3 className="font-semibold text-white mb-1">{fcu.zone}</h3>

                {/* Temperature Display */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-slate-400" />
                    <span className="text-2xl font-bold text-white">{fcu.temp}°</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Setpoint</p>
                    <p className="text-sm text-slate-300">{fcu.setpoint}°C</p>
                  </div>
                </div>

                {/* Fan Speed */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Fan Speed</span>
                    <span className="text-slate-300">{fcu.fanSpeed}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        fcu.fanSpeed > 70 ? 'bg-blue-500' : fcu.fanSpeed > 30 ? 'bg-cyan-500' : 'bg-slate-500'
                      )}
                      style={{ width: `${fcu.fanSpeed}%` }}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-700">
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-700">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-700">
                    <Power className="w-4 h-4" />
                  </Button>
                </div>

                {/* Expanded Controls */}
                {selectedFCU === fcu.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Mode</label>
                      <Select options={modeOptions} value="auto" onChange={() => {}} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Setpoint</label>
                        <div className="flex items-center gap-1">
                          <Input type="number" value={fcu.setpoint} className="w-16 h-8 text-sm" />
                          <span className="text-slate-400">°C</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Fan Speed</label>
                        <Select
                          options={[
                            { value: '0', label: 'Off' },
                            { value: '30', label: 'Low' },
                            { value: '60', label: 'Med' },
                            { value: '100', label: 'High' },
                          ]}
                          value={fcu.fanSpeed >= 70 ? '100' : fcu.fanSpeed >= 30 ? '60' : '30'}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">FCU Control Basics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Thermometer className="w-5 h-5 text-blue-500 mb-2" />
                <h4 className="font-medium text-white mb-1">Temperature Control</h4>
                <p className="text-sm text-slate-400">FCUs regulate room temperature by mixing hot/cold water coils based on setpoint. Use PI control for stable response.</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <Fan className="w-5 h-5 text-green-500 mb-2" />
                <h4 className="font-medium text-white mb-1">Variable Speed Drives</h4>
                <p className="text-sm text-slate-400">VSD fan motors adjust airflow based on cooling/heating demand. Lower speeds save energy and reduce noise.</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Activity className="w-5 h-5 text-orange-500 mb-2" />
                <h4 className="font-medium text-white mb-1">BACnet Integration</h4>
                <p className="text-sm text-slate-400">Modern FCUs support BACnet MS/TP or IP for BMS integration. Setpoints can be adjusted centrally.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}