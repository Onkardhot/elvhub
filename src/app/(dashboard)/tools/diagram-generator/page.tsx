'use client';

import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  GitBranch,
  Camera,
  Lock,
  Flame,
  Speaker,
  Server,
  RefreshCw,
  Download,
  Copy,
  Check,
  Layout,
  ZoomIn,
} from 'lucide-react';
import { DiagramRenderer } from '@/components/features/DiagramRenderer';
import { cn } from '@/lib/utils';

const diagramTypes = [
  { value: 'flowchart', label: 'Flowchart' },
  { value: 'graph', label: 'Graph (Network)' },
  { value: 'sequence', label: 'Sequence Diagram' },
  { value: 'state', label: 'State Diagram' },
];

const systemTemplates = {
  cctv: {
    label: 'CCTV System',
    icon: Camera,
    code: `flowchart TB
    subgraph Cameras["CCTV System"]
        A1["Dome Camera 1"] --> A2["NVR Server"]
        A3["Bullet Camera 2"] --> A2
        A4["PTZ Camera 3"] --> A2
        A5["fisheye Camera 4"] --> A2
    end

    subgraph Network["Network Infrastructure"]
        A2 --> B1["Core Switch"]
        B1 --> B2["PoE Switch"]
    end

    subgraph Monitoring["Monitoring Station"]
        B1 --> C1["Workstation 1"]
        B1 --> C2["Workstation 2"]
        B1 --> C3["Video Wall"]
    end

    subgraph Storage["Storage"]
        A2 --> D1["SAN/NAS Storage"]
        A2 --> D2["Cloud Backup"]
    end`,
  },
  access: {
    label: 'Access Control System',
    icon: Lock,
    code: `flowchart LR
    subgraph Entry["Entry Points"]
        E1["Main Door"] --> R1["Card Reader"]
        E2["Parking Gate"] --> R2["RFID Reader"]
        E3["Server Room"] --> R3["Biometric Reader"]
    end

    subgraph Controllers["Controllers"]
        R1 --> C1["Door Controller 1"]
        R2 --> C2["Door Controller 2"]
        R3 --> C3["Door Controller 3"]
    end

    subgraph Server["Access Server"]
        C1 --> S1["Access Control Server"]
        C2 --> S1
        C3 --> S1
    end

    subgraph Integration["Integration"]
        S1 --> I1["Time & Attendance"]
        S1 --> I2["CCTV Integration"]
        S1 --> I3["Fire Alarm Integration"]
    end`,
  },
  fire: {
    label: 'Fire Alarm System',
    icon: Flame,
    code: `flowchart TB
    subgraph Detection["Detection Devices"]
        D1["Smoke Detector Z1"] --> F1["Fire Panel"]
        D2["Smoke Detector Z1"] --> F1
        D3["Heat Detector Z2"] --> F1
        D4["Manual Call Point Z2"] --> F1
        D5["Smoke Detector Z3"] --> F1
    end

    subgraph Notification["Notification Devices"]
        F1 --> N1["Bell Zone 1"]
        F1 --> N2["Bell Zone 2"]
        F1 --> N3["Strobe Zone 1"]
        F1 --> N4["Strobe Zone 2"]
    end

    subgraph Output["Output Devices"]
        F1 --> O1["Fire Dampers"]
        F1 --> O2["HVAC Shutdown"]
        F1 --> O3["Lift Control"]
        F1 --> O4["Emergency Lighting"]
    end

    subgraph Monitoring["Remote Monitoring"]
        F1 --> M1["BAS Integration"]
        F1 --> M2["Central Station"]
    end`,
  },
  pa: {
    label: 'Public Address System',
    icon: Speaker,
    code: `flowchart LR
    subgraph Source["Audio Sources"]
        S1["Microphone"]
        S2["CD Player"]
        S3["BGM Source"]
        S4["Emergency Mic"]
    end

    subgraph Processing["Audio Processing"]
        S1 --> P1["Mixer"]
        S2 --> P1
        S3 --> P1
        S4 --> P1
        P1 --> P2["Audio Processor"]
        P2 --> P3["Power Amplifier"]
    end

    subgraph Zones["Zone Distribution"]
        P3 --> Z1["Lobby Zone"]
        P3 --> Z2["Corridor Zone"]
        P3 --> Z3["Parking Zone"]
        P3 --> Z4["Emergency Zone"]
    end`,
  },
  network: {
    label: 'Network Topology',
    icon: Server,
    code: `graph TB
    subgraph WAN["WAN / ISP"]
        W1["Internet"]
        W2["MPLS Link"]
    end

    subgraph Core["Core Layer"]
        W1 --> R1["Edge Router"]
        W2 --> R1
        R1 --> F1["Firewall"]
        F1 --> C1["Core Switch"]
    end

    subgraph Distribution["Distribution Layer"]
        C1 --> D1["Switch Floor 1"]
        C1 --> D2["Switch Floor 2"]
        C1 --> D3["Switch Floor 3"]
    end

    subgraph Access["Access Layer"]
        D1 --> A1["PoE Switch"]
        D2 --> A2["PoE Switch"]
        D3 --> A3["PoE Switch"]
    end

    subgraph Endpoints["Endpoints"]
        A1 --> E1["IP Camera"]
        A1 --> E2["IP Phone"]
        A2 --> E3["Access Control"]
        A3 --> E4["Workstation"]
    end`,
  },
};

export default function DiagramGeneratorPage() {
  const [diagramType, setDiagramType] = useState('flowchart');
  const [customCode, setCustomCode] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('cctv');
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);

  const currentCode = customCode || systemTemplates[selectedTemplate as keyof typeof systemTemplates]?.code || '';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentCode]);

  const downloadSVG = useCallback(() => {
    const svgElement = document.querySelector('.flex.items-center.justify-center.overflow-auto svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement as SVGSVGElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagram-${Date.now()}.svg`;
    a.click();
  }, []);

  return (
    <DashboardLayout title="Diagram Generator">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-500" />
              Auto Diagram Generator
            </CardTitle>
            <CardDescription className="text-slate-400">
              Generate system diagrams automatically using Mermaid.js
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Templates Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">System Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(systemTemplates).map(([key, template]) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedTemplate(key);
                        setCustomCode('');
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                        selectedTemplate === key && !customCode
                          ? 'bg-blue-600/20 border border-blue-500/30'
                          : 'bg-slate-800/50 hover:bg-slate-800'
                      )}
                    >
                      <Icon className="w-5 h-5 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-200">{template.label}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Diagram Type</label>
                  <Select
                    options={diagramTypes}
                    value={diagramType}
                    onChange={(e) => setDiagramType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Zoom: {Math.round(zoom * 100)}%</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-700"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-700"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  >
                    +
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Diagram Display */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    {selectedTemplate.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    {diagramType.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-slate-700" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-700" onClick={downloadSVG}>
                    <Download className="w-4 h-4 mr-1" />
                    SVG
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-[400px] bg-slate-950/50 rounded-lg border border-slate-800 overflow-auto p-4"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                >
                  {currentCode ? (
                    <DiagramRenderer chart={currentCode} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      Select a template or enter custom code
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm">Mermaid Code Editor</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700"
                      onClick={() => setCustomCode('')}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700"
                      onClick={() => {
                        navigator.clipboard.writeText(currentCode);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Code
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter Mermaid diagram code..."
                  value={customCode || systemTemplates[selectedTemplate as keyof typeof systemTemplates]?.code || ''}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Use Mermaid syntax for diagrams. See{' '}
                  <a href="https://mermaid.js.org/intro/" target="_blank" className="text-blue-400 hover:underline">
                    Mermaid documentation
                  </a>{' '}
                  for reference.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}