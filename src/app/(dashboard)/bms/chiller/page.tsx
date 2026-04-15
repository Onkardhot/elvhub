'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Thermometer,
  Droplets,
  Gauge,
  Settings,
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Power,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const chillerTypes = [
  { value: 'scroll', label: 'Scroll Compressor' },
  { value: 'screw', label: 'Screw Compressor' },
  { value: 'centrifugal', label: 'Centrifugal' },
  { value: 'absorption', label: 'Absorption' },
];

const coolantTypes = [
  { value: 'r410a', label: 'R-410A' },
  { value: 'r134a', label: 'R-134a' },
  { value: 'r407c', label: 'R-407C' },
  { value: 'water', label: 'Water/Glycol' },
];

const statusColors: Record<string, string> = {
  running: 'bg-green-600',
  standby: 'bg-yellow-600',
  fault: 'bg-red-600',
  off: 'bg-slate-600',
};

const mockChillers = [
  { id: 'CH-01', name: 'Primary Chiller', type: 'Centrifugal', capacity: 800, load: 72, status: 'running', temp: 6.2, pressure: 8.2 },
  { id: 'CH-02', name: 'Secondary Chiller', type: 'Screw', capacity: 500, load: 65, status: 'running', temp: 6.8, pressure: 7.8 },
  { id: 'CH-03', name: 'Backup Chiller', type: 'Screw', capacity: 500, load: 0, status: 'standby', temp: 7.1, pressure: 7.5 },
  { id: 'CH-04', name: 'Emergency Chiller', type: 'Absorption', capacity: 300, load: 0, status: 'off', temp: 0, pressure: 0 },
];

export default function ChillerPage() {
  const [selectedChiller, setSelectedChiller] = useState<string | null>(null);
  const [showDesignTool, setShowDesignTool] = useState(false);
  const [designInput, setDesignInput] = useState({
    coolingLoad: '',
    deltaT: '6',
    chillerType: 'screw',
    efficiency: '5.5',
  });
  const [designResult, setDesignResult] = useState<any>(null);

  const calculateChiller = () => {
    const load = parseFloat(designInput.coolingLoad) || 0;
    const dT = parseFloat(designInput.deltaT) || 6;
    const cop = parseFloat(designInput.efficiency) || 5.5;

    if (!load) return;

    // Flow rate calculation: Q = m * Cp * dT
    // Water: Q (kW) = flow (l/s) * 4.186 * dT
    // Flow (l/s) = Q / (4.186 * dT)
    // Convert to m3/hr: flow_m3hr = (load * 1000) / (4.186 * dT * 3600 / 1000) = load * 238.4 / dT
    const flowRate = (load * 238.4) / dT;

    // Power consumption
    const powerInput = load / cop;

    // Condenser water requirements
    const condenserDeltaT = 5;
    const condenserFlow = (load * 238.4) / condenserDeltaT;

    setDesignResult({
      flowRate: flowRate.toFixed(1),
      powerInput: powerInput.toFixed(1),
      condenserFlow: condenserFlow.toFixed(1),
      efficiency: (load / powerInput).toFixed(2),
      estCostPerHour: (powerInput * 0.12).toFixed(2), // $0.12/kWh
    });
  };

  return (
    <DashboardLayout title="Chiller Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Chiller Plant</h2>
            <p className="text-slate-400 text-sm">Central cooling plant management & monitoring</p>
          </div>
          <Button
            variant="outline"
            className="border-slate-700"
            onClick={() => setShowDesignTool(!showDesignTool)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {showDesignTool ? 'Hide' : 'Show'} Design Tool
          </Button>
        </div>

        {/* Design Tool */}
        {showDesignTool && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Chiller Sizing Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Cooling Load (kW)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      value={designInput.coolingLoad}
                      onChange={(e) => setDesignInput({ ...designInput, coolingLoad: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Chiller Type</label>
                      <Select
                        options={chillerTypes}
                        value={designInput.chillerType}
                        onChange={(e) => setDesignInput({ ...designInput, chillerType: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Delta T (°C)</label>
                      <Input
                        type="number"
                        value={designInput.deltaT}
                        onChange={(e) => setDesignInput({ ...designInput, deltaT: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Target COP</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={designInput.efficiency}
                      onChange={(e) => setDesignInput({ ...designInput, efficiency: e.target.value })}
                    />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={calculateChiller}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate
                  </Button>
                </div>

                {designResult && (
                  <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                      <p className="text-xs text-slate-400">Chilled Water Flow</p>
                      <p className="text-xl font-bold text-white">{designResult.flowRate} m³/hr</p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Zap className="w-5 h-5 text-orange-500 mb-2" />
                      <p className="text-xs text-slate-400">Power Input</p>
                      <p className="text-xl font-bold text-white">{designResult.powerInput} kW</p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <Thermometer className="w-5 h-5 text-cyan-500 mb-2" />
                      <p className="text-xs text-slate-400">Condenser Flow</p>
                      <p className="text-xl font-bold text-white">{designResult.condenserFlow} m³/hr</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <Gauge className="w-5 h-5 text-green-500 mb-2" />
                      <p className="text-xs text-slate-400">Est. Cost/Hour</p>
                      <p className="text-xl font-bold text-white">${designResult.estCostPerHour}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chiller Status Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockChillers.map((chiller) => (
            <Card
              key={chiller.id}
              className={cn(
                'bg-slate-900/50 border-slate-800 cursor-pointer transition-colors hover:border-blue-500/30',
                selectedChiller === chiller.id && 'border-blue-500/50'
              )}
              onClick={() => setSelectedChiller(chiller.id === selectedChiller ? null : chiller.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={statusColors[chiller.status]}>{chiller.status}</Badge>
                  <span className="text-xs text-slate-500">{chiller.type}</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{chiller.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{chiller.id}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Capacity</span>
                    <span className="text-sm text-white">{chiller.capacity} kW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Load</span>
                    <span className="text-sm text-white">{chiller.load}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${chiller.load}%` }} />
                  </div>
                </div>

                {chiller.status === 'running' && (
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500">CHW Temp</p>
                      <p className="text-sm text-white">{chiller.temp}°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Pressure</p>
                      <p className="text-sm text-white">{chiller.pressure} bar</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Control Parameters */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Control Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="text-sm text-slate-300">Chilled Water Setpoint</label>
                <div className="flex items-center gap-2">
                  <Input type="number" value="7" className="w-20" />
                  <span className="text-slate-400">°C</span>
                </div>
                <input type="range" min="5" max="10" value="7" className="w-full" />
              </div>
              <div className="space-y-3">
                <label className="text-sm text-slate-300">Condenser Water Setpoint</label>
                <div className="flex items-center gap-2">
                  <Input type="number" value="27" className="w-20" />
                  <span className="text-slate-400">°C</span>
                </div>
                <input type="range" min="20" max="35" value="27" className="w-full" />
              </div>
              <div className="space-y-3">
                <label className="text-sm text-slate-300">Load Balancing Mode</label>
                <Select
                  options={[
                    { value: 'lead_lag', label: 'Lead-Lag' },
                    { value: 'parallel', label: 'Parallel' },
                    { value: 'cascade', label: 'Cascade' },
                  ]}
                  value="lead_lag"
                  onChange={() => {}}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm text-slate-300">Auto Restart</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked className="w-4 h-4" />
                  <span className="text-sm text-slate-300">Enable after power restore</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Curves Info */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Chiller Performance Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                <h4 className="font-medium text-white mb-1">Optimal Range</h4>
                <p className="text-sm text-slate-400">Chillers operate most efficiently at 60-80% load. Avoid prolonged operation below 30%.</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mb-2" />
                <h4 className="font-medium text-white mb-1">Warning Signs</h4>
                <p className="text-sm text-slate-400">Condenser approach > 10°C or chilled water delta T < 4°C indicates problems.</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Zap className="w-5 h-5 text-blue-500 mb-2" />
                <h4 className="font-medium text-white mb-1">Energy Saving</h4>
                <p className="text-sm text-slate-400">Each 1°C increase in chilled water setpoint saves ~3% compressor energy.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}