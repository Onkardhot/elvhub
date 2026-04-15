'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Camera,
  MapPin,
  DollarSign,
  Info,
  RotateCcw,
} from 'lucide-react';

interface CameraPosition {
  id: number;
  x: number;
  y: number;
  angle: number;
  type: 'fixed' | 'ptz' | 'dome';
  coverage: string;
}

export default function CCTVCCalculatorPage() {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('');
  const [roomType, setRoomType] = useState('office');
  const [coverageLevel, setCoverageLevel] = useState('standard');
  const [result, setResult] = useState<{
    cameraCount: number;
    cameraPositions: CameraPosition[];
    totalCost: number;
    recommendations: string[];
  } | null>(null);

  const roomTypeOptions = [
    { value: 'office', label: 'Office' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'corridor', label: 'Corridor' },
    { value: 'lobby', label: 'Lobby' },
    { value: 'parking', label: 'Parking Lot' },
  ];

  const coverageLevelOptions = [
    { value: 'basic', label: 'Basic Coverage' },
    { value: 'standard', label: 'Standard Coverage' },
    { value: 'high', label: 'High Security Coverage' },
  ];

  const calculateCCTV = () => {
    const length = parseFloat(roomLength) || 0;
    const width = parseFloat(roomWidth) || 0;
    const height = parseFloat(roomHeight) || 0;

    if (!length || !width || !height) {
      return;
    }

    const area = length * width;

    let baseCameraCount = Math.ceil(area / 25);
    if (roomType === 'warehouse') baseCameraCount = Math.ceil(area / 40);
    if (roomType === 'corridor') baseCameraCount = Math.ceil(length / 10);
    if (roomType === 'lobby') baseCameraCount = Math.max(2, Math.ceil(area / 20));
    if (roomType === 'parking') baseCameraCount = Math.ceil(area / 30);

    const coverageMultiplier = coverageLevel === 'basic' ? 0.7 : coverageLevel === 'high' ? 1.5 : 1;
    const cameraCount = Math.max(1, Math.ceil(baseCameraCount * coverageMultiplier));

    const cameraPositions: CameraPosition[] = [];
    for (let i = 0; i < cameraCount; i++) {
      const angle = (360 / cameraCount) * i;
      cameraPositions.push({
        id: i + 1,
        x: width / 2 + (width / 4) * Math.cos((angle * Math.PI) / 180),
        y: length / 2 + (length / 4) * Math.sin((angle * Math.PI) / 180),
        angle: angle,
        type: roomType === 'warehouse' || roomType === 'parking' ? 'ptz' : 'dome',
        coverage: `Coverage Area ${i + 1}`,
      });
    }

    const cameraCost = cameraCount * 150;
    const installationCost = cameraCount * 75;
    const totalCost = cameraCost + installationCost;

    const recommendations = [
      `Recommended camera type: ${cameraPositions[0]?.type === 'ptz' ? 'PTZ for wide area coverage' : 'Dome cameras for discreet coverage'}`,
      `Optimal mounting height: ${height > 3 ? '3.5-4m' : '2.5-3m'} from floor level`,
      `Consider ${Math.ceil(cameraCount / 4)} NVR channels for future expansion`,
      `DVR storage recommendation: ${cameraCount * 7} days @ 1080p`,
    ];

    setResult({ cameraCount, cameraPositions, totalCost, recommendations });
  };

  const resetCalculator = () => {
    setRoomLength('');
    setRoomWidth('');
    setRoomHeight('');
    setRoomType('office');
    setCoverageLevel('standard');
    setResult(null);
  };

  return (
    <DashboardLayout title="CCTV Calculator">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              Room Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter the room dimensions to calculate optimal camera placement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Room Length (m)</label>
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Room Width (m)</label>
                <Input
                  type="number"
                  placeholder="e.g., 8"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Ceiling Height (m)</label>
              <Input
                type="number"
                placeholder="e.g., 3"
                value={roomHeight}
                onChange={(e) => setRoomHeight(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Room Type</label>
                <Select options={roomTypeOptions} value={roomType} onChange={(e) => setRoomType(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Coverage Level</label>
                <Select options={coverageLevelOptions} value={coverageLevel} onChange={(e) => setCoverageLevel(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={calculateCCTV}>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              <Button variant="outline" onClick={resetCalculator}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              Calculation Results
            </CardTitle>
            <CardDescription className="text-slate-400">
              Recommended camera count and placement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Camera className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{result.cameraCount}</div>
                    <div className="text-xs text-slate-400">Cameras</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <MapPin className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{result.cameraPositions.length}</div>
                    <div className="text-xs text-slate-400">Positions</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <DollarSign className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">${result.totalCost}</div>
                    <div className="text-xs text-slate-400">Est. Cost</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Camera Positions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {result.cameraPositions.map((pos) => (
                      <div key={pos.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            Camera {pos.id}
                          </Badge>
                          <Badge className={pos.type === 'ptz' ? 'bg-purple-600' : pos.type === 'dome' ? 'bg-blue-600' : 'bg-slate-600'}>
                            {pos.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-400 space-y-1">
                          <p>X: {pos.x.toFixed(1)}m, Y: {pos.y.toFixed(1)}m</p>
                          <p>Angle: {pos.angle.toFixed(0)}°</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                  <Calculator className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400">Enter room dimensions to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}