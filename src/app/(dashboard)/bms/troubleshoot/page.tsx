'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  Search,
  Wrench,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Zap,
  CheckCircle,
  ArrowRight,
  FileText,
  MessageSquare,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const diagnosticCategories = [
  { value: 'ahu', label: 'AHU Issues', icon: Wind },
  { value: 'chiller', label: 'Chiller Issues', icon: Thermometer },
  { value: 'fcu', label: 'FCU Issues', icon: Droplets },
  { value: 'sensors', label: 'Sensor Problems', icon: Gauge },
  { value: 'control', label: 'Control Issues', icon: Zap },
  { value: 'network', label: 'Network/Comms', icon: Zap },
];

const diagnosticGuides = [
  {
    category: 'ahu',
    title: 'AHU Not Cooling/Heating',
    symptoms: ['No cold air', 'Insufficient cooling', 'Temperature swings'],
    causes: [
      { issue: 'Chilled water valve not opening', solution: 'Check 24V AC signal, verify valve actuator works, check for airlocks in coil' },
      { issue: 'Fan not running at correct speed', solution: 'Verify VFD settings, check motor windings, inspect belt condition if belt-driven' },
      { issue: 'Dirty filters causing low airflow', solution: 'Replace G4 pre-filter, check F7 final filter pressure drop' },
      { issue: 'Mixed air damper stuck', solution: 'Check damper actuator, verify BACnet signal for economizer mode' },
    ],
  },
  {
    category: 'ahu',
    title: 'High Duct Static Pressure',
    symptoms: ['Whistling noise', 'Low airflow to some zones', 'Fan motor overload'],
    causes: [
      { issue: 'Dirty filters', solution: 'Replace filters when pressure drop > 250Pa' },
      { issue: 'Blocked return air grille', solution: 'Check and clean return air grilles' },
      { issue: 'Ductwork damage or disconnections', solution: 'Inspect ductwork for air leaks, seal with duct mastic' },
      { issue: 'Incorrect fan speed setting', solution: 'Verify VFD is set to correct Hz for design airflow' },
    ],
  },
  {
    category: 'chiller',
    title: 'Chiller Not Starting',
    symptoms: ['Chiller in fault', 'No cooling', 'Alarm panel active'],
    causes: [
      { issue: 'Safety interlocks open', solution: 'Check condenser water flow, verify all safety switches (high pressure, low pressure, oil pressure)' },
      { issue: 'Master control communication lost', solution: 'Verify BACnet or Modbus communication, check twisted pair wiring' },
      { issue: 'Power supply issue', solution: 'Check main breaker, verify 24V control power transformer' },
      { issue: 'Remote start/stop in OFF position', solution: 'Check BAS start command and local emergency stop status' },
    ],
  },
  {
    category: 'chiller',
    title: 'High Condenser Water Temperature',
    symptoms: ['Reduced chiller capacity', 'High head pressure alarm', 'Poor efficiency'],
    causes: [
      { issue: 'Cooling tower performance', solution: 'Check basin water level, verify fan operation, clean fills' },
      { issue: 'Condenser tube fouling', solution: 'Schedule tube cleaning, check water treatment program' },
      { issue: 'Excess refrigerant charge', solution: 'Subtract charge until manufacturer-specified head pressure achieved' },
      { issue: 'Non-condensables in system', solution: 'Perform refrigerant leak check, evacuate and recharge' },
    ],
  },
  {
    category: 'fcu',
    title: 'FCU Fan Not Running',
    symptoms: ['No airflow', 'Zone too warm/cold', 'Complaint from occupants'],
    causes: [
      { issue: 'Power failure to unit', solution: 'Check circuit breaker, verify 24V AC to fan relay' },
      { issue: 'Fan motor burned out', solution: 'Check motor resistance (should be 10-50 ohms between windings), replace if failed' },
      { issue: 'Capacitor failed (AC fan)', solution: 'Replace run capacitor (typically 2-5 µF for PSC motors)' },
      { issue: 'Fan relay stuck', solution: 'Check relay coil resistance, swap with known-good relay' },
    ],
  },
  {
    category: 'fcu',
    title: 'Zone Temperature Too High (Cooling Mode)',
    symptoms: ['Room warm', 'FCU running but not cooling', 'Setpoint not reached'],
    causes: [
      { issue: 'Chilled water valve stuck closed', solution: 'Actuate valve manually, check for 2-10V signal from controller' },
      { issue: 'Air in coil', solution: 'Bleed coil at highest point, check expansion tank level' },
      { issue: 'Wrong mode selected', solution: 'Verify BAS mode command, check local switch settings' },
      { issue: 'Dirty filter restricting airflow', solution: 'Replace or clean filter' },
    ],
  },
  {
    category: 'sensors',
    title: 'Erratic Temperature Readings',
    symptoms: ['Jumping values', 'Spontaneous mode changes', 'Alarm floods'],
    causes: [
      { issue: 'Sensor wiring issues', solution: 'Check for loose connections, broken shielding, proximity to electrical noise sources' },
      { issue: 'Sensor drift over time', solution: 'Compare to calibrated thermometer, replace if > 1°C variance' },
      { issue: 'Improper sensor location', solution: 'Verify sensor not near heat sources, drafts, direct sunlight, or supply air diffuser' },
      { issue: 'Analog input card failure', solution: 'Swap input with known-working sensor to isolate card vs wiring' },
    ],
  },
  {
    category: 'network',
    title: 'BACnet Communication Failure',
    symptoms: ['Devices offline', 'Commands not reaching', 'Timeouts in BAS'],
    causes: [
      { issue: 'Duplicate MAC address', solution: 'Check all devices for unique MS/TP address (0-127 for MS/TP)' },
      { issue: 'Incorrect baud rate', solution: 'Verify all devices on segment set to 76.8 kbps for MS/TP, or correct IP settings' },
      { issue: 'Missing or bad terminators', solution: 'Install 120Ω terminators at both ends of MS/TP trunk' },
      { issue: 'Wire type violation', solution: 'Use Belden 3082A or similar shielded twisted pair for MS/TP' },
    ],
  },
];

const faultCodes = [
  { code: 'E001', description: 'High compressor discharge temperature', system: 'Chiller' },
  { code: 'E002', description: 'Low suction pressure', system: 'Chiller' },
  { code: 'E003', description: 'High head pressure', system: 'Chiller' },
  { code: 'E101', description: 'Dirty filter alarm', system: 'AHU' },
  { code: 'E102', description: 'Duct static pressure high', system: 'AHU' },
  { code: 'E103', description: 'Fan overload trip', system: 'AHU' },
  { code: 'E201', description: 'Communication timeout', system: 'Network' },
  { code: 'E202', description: 'Analog input out of range', system: 'Sensors' },
];

export default function BMSTroubleshootPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = diagnosticGuides.filter((guide) => {
    if (selectedCategory && guide.category !== selectedCategory) return false;
    if (selectedSymptom && !guide.symptoms.some((s) => s.toLowerCase().includes(selectedSymptom.toLowerCase()))) return false;
    if (searchQuery && !guide.title.toLowerCase().includes(searchQuery.toLowerCase()) && !guide.causes.some((c) => c.issue.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  return (
    <DashboardLayout title="BMS Troubleshooting">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-500" />
              BMS Troubleshooting Guide
            </CardTitle>
            <CardDescription className="text-slate-400">
              Diagnostic tools and fault resolution for BMS systems
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search by fault, symptom, or cause..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                options={[{ value: '', label: 'All Categories' }, ...diagnosticCategories]}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Fault Codes Reference */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Common Fault Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {faultCodes.map((fault) => (
                <div key={fault.code} className="p-3 rounded-lg bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <Badge className="bg-red-600 mb-1">{fault.code}</Badge>
                    <p className="text-xs text-slate-300">{fault.description}</p>
                  </div>
                  <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                    {fault.system}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic Categories */}
        <div className="flex flex-wrap gap-2">
          {diagnosticCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                className={selectedCategory === cat.value ? 'bg-blue-600' : 'border-slate-700'}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Diagnostic Guides */}
        <div className="space-y-4">
          {filteredGuides.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="py-12 text-center">
                <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">No diagnostic guides found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredGuides.map((guide) => (
              <Card key={guide.title} className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                        {guide.category.toUpperCase()}
                      </Badge>
                      <CardTitle className="text-white">{guide.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {guide.symptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="outline"
                        className="border-slate-700 text-slate-400 text-xs cursor-pointer hover:border-yellow-500"
                        onClick={() => setSelectedSymptom(symptom)}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guide.causes.map((cause, i) => (
                      <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-yellow-500">{i + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-2">{cause.issue}</h4>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <p className="text-sm text-slate-300">{cause.solution}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Diagnostic Tool */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              AI Diagnostic Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Textarea
                placeholder="Describe the problem or paste error codes..."
                className="min-h-[80px]"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 shrink-0">
                <MessageSquare className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}