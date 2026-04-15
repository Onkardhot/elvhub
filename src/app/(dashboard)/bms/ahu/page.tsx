'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  Settings,
  Play,
  RotateCcw,
  Download,
  Cpu,
  Fan,
  Filter,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AHUDesignResult {
  coolingCapacity: number;
  heatingCapacity: number;
  airflow: number;
  requiredFans: number;
  filters: string[];
  sensors: string[];
  controlSequence: string[];
  reheatingRequired: boolean;
  humidificationRequired: boolean;
}

const temperatureOptions = [
  { value: '18', label: '18°C (Cool)' },
  { value: '20', label: '20°C (Standard)' },
  { value: '22', label: '22°C (Comfort)' },
  { value: '24', label: '24°C (Warm)' },
];

const roomTypeOptions = [
  { value: 'office', label: 'Office' },
  { value: 'server', label: 'Server Room' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
];

const controlSequenceSteps = [
  { step: 1, title: 'Supply Air Temperature Sensing', description: 'Measured via supply air temperature sensor (SAT). Controls heating/cooling valves.' },
  { step: 2, title: 'Setpoint Comparison', description: 'SAT reading compared to cooling setpoint (typically 12-14°C) or heating setpoint (typically 35-40°C).' },
  { step: 3, title: 'PID Control Output', description: 'PI or PID controller calculates valve positions for chilled water (cooling) and hot water (heating).' },
  { step: 4, title: 'Fan Speed Modulation', description: 'Variable Frequency Drive (VFD) modulates supply fan speed based on duct static pressure or CO2 levels.' },
  { step: 5, title: 'Economizer Check', description: 'If outdoor temperature < 14°C and humidity < 10g/kg, enable free cooling (100% outdoor air).' },
  { step: 6, title: 'Humidifier Control', description: 'If space humidity < 40% RH, enable steam humidifier to maintain humidity setpoint.' },
  { step: 7, title: 'Filter Monitoring', description: 'Differential pressure gauges monitor filter loading. Alert when pressure drop > 250Pa.' },
  { step: 8, title: 'Fire/Smoke Integration', description: 'Upon fire alarm, close outdoor air dampers, shut down fans, and open fire dampers.' },
];

export default function AHUPage() {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('');
  const [temperatureSetpoint, setTemperatureSetpoint] = useState('22');
  const [airflowCFM, setAirflowCFM] = useState('');
  const [roomType, setRoomType] = useState('office');
  const [result, setResult] = useState<AHUDesignResult | null>(null);

  const calculateAHU = () => {
    const length = parseFloat(roomLength) || 0;
    const width = parseFloat(roomWidth) || 0;
    const height = parseFloat(roomHeight) || 0;
    const cfm = parseFloat(airflowCFM) || 0;
    const tempSet = parseInt(temperatureSetpoint) || 22;

    if (!length || !width || !height) return;

    const roomVolume = length * width * height;

    // Calculate CFM if not provided (10-15 air changes per hour based on room type)
    const airChangesPerHour = roomType === 'server' ? 20 : roomType === 'hospital' ? 12 : roomType === 'industrial' ? 8 : 10;
    const calculatedCFM = cfm || Math.ceil(roomVolume * airChangesPerHour / 60);

    // Heat load calculation (simplified)
    const heatLoadPerCFM = roomType === 'server' ? 0.85 : roomType === 'hospital' ? 0.45 : roomType === 'industrial' ? 0.6 : 0.35;
    const coolingCapacity = Math.ceil(calculatedCFM * heatLoadPerCFM);

    // Heating capacity (typically 80-120% of cooling)
    const heatingCapacity = Math.ceil(coolingCapacity * (roomType === 'server' ? 0.5 : 0.8));

    // Calculate fans needed (typical 2000-4000 CFM per fan)
    const cfmPerFan = roomType === 'server' ? 2000 : 3000;
    const requiredFans = Math.ceil(calculatedCFM / cfmPerFan);

    // Required sensors
    const sensors = [
      'Supply Air Temperature (SAT) Sensor',
      'Return Air Temperature (RAT) Sensor',
      'Outdoor Air Temperature (OAT) Sensor',
      'Duct Static Pressure Sensor',
      'Filter Differential Pressure Sensor',
    ];

    if (roomType === 'hospital') {
      sensors.push('CO2 Sensor (for demand control ventilation)');
      sensors.push('Humidity Sensor');
    }

    // Required filters
    const filters = [
      'G4 (EU4) Pre-filter (Farr > 90%)',
      'F7 (EU7) Fine filter (for hospital/server)',
    ];

    // Control sequence
    const controlSequence = controlSequenceSteps.map((s) => `${s.step}. ${s.title}: ${s.description}`);

    setResult({
      coolingCapacity,
      heatingCapacity,
      airflow: calculatedCFM,
      requiredFans,
      filters,
      sensors,
      controlSequence,
      reheatingRequired: roomType === 'hospital' || tempSet < 20,
      humidificationRequired: roomType === 'hospital' || roomType === 'server',
    });
  };

  const resetCalculator = () => {
    setRoomLength('');
    setRoomWidth('');
    setRoomHeight('');
    setTemperatureSetpoint('22');
    setAirflowCFM('');
    setRoomType('office');
    setResult(null);
  };

  return (
    <DashboardLayout title="AHU Design Tool">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              Air Handling Unit (AHU) Design Tool
            </CardTitle>
            <CardDescription className="text-slate-400">
              Calculate AHU capacity, sensors, and control sequences
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Design Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Room Length (m)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 20"
                    value={roomLength}
                    onChange={(e) => setRoomLength(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Room Width (m)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 15"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Height (m)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 3"
                    value={roomHeight}
                    onChange={(e) => setRoomHeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Temperature Setpoint</label>
                  <Select
                    options={temperatureOptions}
                    value={temperatureSetpoint}
                    onChange={(e) => setTemperatureSetpoint(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Room Type</label>
                  <Select
                    options={roomTypeOptions}
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Airflow (CFM) - Leave empty to auto-calculate</label>
                <Input
                  type="number"
                  placeholder="e.g., 2000"
                  value={airflowCFM}
                  onChange={(e) => setAirflowCFM(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={calculateAHU}>
                  <Play className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={resetCalculator}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Design Output</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {/* Capacity Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Thermometer className="w-5 h-5 text-blue-500 mb-2" />
                      <p className="text-xs text-slate-400">Cooling Capacity</p>
                      <p className="text-xl font-bold text-white">{result.coolingCapacity} kW</p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Thermometer className="w-5 h-5 text-orange-500 mb-2" />
                      <p className="text-xs text-slate-400">Heating Capacity</p>
                      <p className="text-xl font-bold text-white">{result.heatingCapacity} kW</p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <Wind className="w-5 h-5 text-cyan-500 mb-2" />
                      <p className="text-xs text-slate-400">Airflow</p>
                      <p className="text-xl font-bold text-white">{result.airflow} CFM</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <Fan className="w-5 h-5 text-green-500 mb-2" />
                      <p className="text-xs text-slate-400">Supply Fans</p>
                      <p className="text-xl font-bold text-white">{result.requiredFans}</p>
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div className="flex flex-wrap gap-2">
                    {result.reheatingRequired && (
                      <Badge className="bg-orange-600">Reheating Required</Badge>
                    )}
                    {result.humidificationRequired && (
                      <Badge className="bg-blue-600">Humidification Required</Badge>
                    )}
                  </div>

                  {/* Sensors */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      Required Sensors
                    </h4>
                    <div className="space-y-1">
                      {result.sensors.map((sensor, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                          {sensor}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-blue-500" />
                      Required Filters
                    </h4>
                    <div className="space-y-1">
                      {result.filters.map((filter, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                          {filter}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wind className="w-12 h-12 text-slate-700 mb-4" />
                  <p className="text-slate-400">Enter room dimensions to calculate AHU requirements</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Control Sequence */}
        {result && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Control Sequence (Step-by-Step)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {controlSequenceSteps.map((step) => (
                  <div key={step.step} className="flex gap-4 p-4 rounded-lg bg-slate-800/50">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">{step.step}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">{step.title}</h4>
                      <p className="text-sm text-slate-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}