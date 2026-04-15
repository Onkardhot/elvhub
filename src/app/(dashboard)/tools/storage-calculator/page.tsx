'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  HardDrive,
  Calculator,
  Database,
  Clock,
  Server,
  AlertCircle,
  CheckCircle,
  Camera,
} from 'lucide-react';

interface CameraConfig {
  id: string;
  resolution: string;
  fps: number;
  codec: string;
  bitrate: number;
  retentionDays: number;
}

const resolutionOptions = [
  { value: '720p', label: '720p (HD)' },
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '4MP', label: '4MP (2K)' },
  { value: '4K', label: '4K (8MP)' },
  { value: '8K', label: '8K (12MP)' },
];

const codecOptions = [
  { value: 'H.264', label: 'H.264' },
  { value: 'H.265', label: 'H.265 (HEVC)' },
  { value: 'H.265+', label: 'H.265+ (Smart Codec)' },
];

const resolutionBitrates: Record<string, { min: number; max: number; typical: number }> = {
  '720p': { min: 1, max: 2, typical: 1.5 },
  '1080p': { min: 2, max: 4, typical: 3 },
  '4MP': { min: 4, max: 8, typical: 6 },
  '4K': { min: 8, max: 16, typical: 12 },
  '8K': { min: 16, max: 32, typical: 24 },
};

const commonHardDriveSizes = [1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 36, 48];

export default function StorageCalculatorPage() {
  const [cameras, setCameras] = useState<CameraConfig[]>([
    { id: '1', resolution: '1080p', fps: 30, codec: 'H.265', bitrate: 3, retentionDays: 30 },
  ]);
  const [raidEnabled, setRaidEnabled] = useState(false);
  const [raidType, setRaidType] = useState('5');

  const addCamera = () => {
    setCameras([...cameras, {
      id: Date.now().toString(),
      resolution: '1080p',
      fps: 30,
      codec: 'H.265',
      bitrate: 3,
      retentionDays: 30,
    }]);
  };

  const removeCamera = (id: string) => {
    setCameras(cameras.filter((c) => c.id !== id));
  };

  const updateCamera = (id: string, field: keyof CameraConfig, value: string | number) => {
    setCameras(cameras.map((c) => {
      if (c.id !== id) return c;
      const updated = { ...c, [field]: value };

      // Auto-update bitrate when resolution changes
      if (field === 'resolution') {
        updated.bitrate = resolutionBitrates[value as string].typical;
      }
      // Reduce bitrate for smart codec
      if (field === 'codec' && value === 'H.265+') {
        updated.bitrate = updated.bitrate * 0.5;
      }

      return updated;
    }));
  };

  const calculations = useMemo(() => {
    const totalBitrate = cameras.reduce((sum, cam) => sum + cam.bitrate, 0);
    const bitsPerSecond = totalBitrate * 1000000; // Mbps to bps
    const bytesPerSecond = bitsPerSecond / 8;
    const bytesPerDay = bytesPerSecond * 86400;

    const cameraStorage = cameras.map((cam) => {
      const bits = cam.bitrate * 1000000;
      const bytes = bits / 8;
      const dailyBytes = bytes * 86400;
      const totalBytes = dailyBytes * cam.retentionDays;
      return { ...cam, dailyGB: dailyBytes / (1024 * 1024 * 1024), totalGB: totalBytes / (1024 * 1024 * 1024) };
    });

    const totalDailyGB = cameraStorage.reduce((sum, cam) => sum + cam.dailyGB, 0);
    const totalStorageGB = cameraStorage.reduce((sum, cam) => sum + cam.totalGB, 0);

    // Account for RAID overhead
    const raidMultiplier = raidEnabled ? (raidType === '5' ? 1.33 : raidType === '6' ? 1.5 : raidType === '10' ? 2 : 1) : 1;
    const effectiveStorageGB = totalStorageGB * raidMultiplier;

    // Calculate required drives
    const requiredDrives = commonHardDriveSizes.map((size) => ({
      size,
      count: Math.ceil(effectiveStorageGB / (size * 1024)),
      usableGB: size * 1024,
      wasteGB: Math.max(0, (size * 1024) - effectiveStorageGB),
    })).filter((d) => d.count > 0).sort((a, b) => a.count - b.count);

    const recommendedDrive = requiredDrives[0];

    return {
      totalBitrate,
      totalDailyGB,
      totalStorageGB,
      effectiveStorageGB,
      raidMultiplier,
      cameraStorage,
      requiredDrives,
      recommendedDrive,
    };
  }, [cameras, raidEnabled, raidType]);

  const updateBitrate = (id: string, value: number) => {
    setCameras(cameras.map((c) => c.id === id ? { ...c, bitrate: value } : c));
  };

  return (
    <DashboardLayout title="Storage Calculator">
      <div className="space-y-6">
        {/* Header Info */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-500" />
              CCTV Storage Calculator
            </CardTitle>
            <CardDescription className="text-slate-400">
              Calculate storage requirements for CCTV/NVR systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                <Camera className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{cameras.length}</div>
                <div className="text-xs text-slate-400">Cameras</div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{Math.max(...cameras.map((c) => c.retentionDays))}</div>
                <div className="text-xs text-slate-400">Retention Days</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                <Database className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{calculations.totalDailyGB.toFixed(1)} GB</div>
                <div className="text-xs text-slate-400">Per Day</div>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                <Server className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{calculations.totalStorageGB.toFixed(0)} GB</div>
                <div className="text-xs text-slate-400">Total Required</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Configurations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Camera Configuration</h3>
              <Button variant="outline" className="border-slate-700" onClick={addCamera}>
                <Calculator className="w-4 h-4 mr-2" />
                Add Camera
              </Button>
            </div>

            {cameras.map((camera, index) => (
              <Card key={camera.id} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        Camera {index + 1}
                      </Badge>
                    </div>
                    {cameras.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => removeCamera(camera.id)}
                      >
                        ×
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Resolution</label>
                      <Select
                        options={resolutionOptions}
                        value={camera.resolution}
                        onChange={(e) => updateCamera(camera.id, 'resolution', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Codec</label>
                      <Select
                        options={codecOptions}
                        value={camera.codec}
                        onChange={(e) => updateCamera(camera.id, 'codec', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Retention (days)</label>
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={camera.retentionDays}
                        onChange={(e) => updateCamera(camera.id, 'retentionDays', parseInt(e.target.value) || 30)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Bitrate (Mbps)</label>
                      <Input
                        type="number"
                        min="0.5"
                        max="64"
                        step="0.5"
                        value={camera.bitrate}
                        onChange={(e) => updateBitrate(camera.id, parseFloat(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Storage per camera:</span>
                      <span className="text-white font-medium">
                        {calculations.cameraStorage.find((c) => c.id === camera.id)?.totalGB.toFixed(2) || '0'} GB
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* RAID Configuration */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={raidEnabled}
                      onChange={(e) => setRaidEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600"
                    />
                    <div>
                      <p className="text-white font-medium">Enable RAID Protection</p>
                      <p className="text-xs text-slate-400">Adds redundancy overhead</p>
                    </div>
                  </div>
                  {raidEnabled && (
                    <Select
                      options={[
                        { value: '5', label: 'RAID 5 (1 drive parity)' },
                        { value: '6', label: 'RAID 6 (2 drive parity)' },
                        { value: '10', label: 'RAID 10 (Mirroring)' },
                      ]}
                      value={raidType}
                      onChange={(e) => setRaidType(e.target.value)}
                      className="w-48"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Storage Results */}
          <div className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Total Storage Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
                  <div className="text-4xl font-bold text-white mb-1">
                    {calculations.effectiveStorageGB >= 1024
                      ? `${(calculations.effectiveStorageGB / 1024).toFixed(1)} TB`
                      : `${calculations.effectiveStorageGB.toFixed(0)} GB`}
                  </div>
                  <div className="text-sm text-slate-400">
                    {raidEnabled ? `(${calculations.raidMultiplier}x RAID-${raidType} overhead)` : 'No RAID'}
                  </div>
                </div>

                {calculations.recommendedDrive && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-white">Recommended Setup</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      {calculations.recommendedDrive.count} × {calculations.recommendedDrive.size}TB drives
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {calculations.recommendedDrive.size * calculations.recommendedDrive.count}TB total ({calculations.recommendedDrive.wasteGB > 0 ? `${calculations.recommendedDrive.wasteGB.toFixed(0)}GB wasted` : 'efficient'})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Drive Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {calculations.requiredDrives.slice(0, 5).map((drive) => (
                    <div
                      key={`${drive.size}-${drive.count}`}
                      className={`flex items-center justify-between p-3 rounded-lg ${drive.count === calculations.recommendedDrive?.count ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-slate-800/50'}`}
                    >
                      <div>
                        <p className="text-white font-medium">{drive.count} × {drive.size}TB</p>
                        <p className="text-xs text-slate-400">{drive.count === 1 ? 'Single drive' : `${drive.count} drives needed`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-300">{drive.usableGB.toLocaleString()}GB usable</p>
                        {drive.wasteGB > 0 && (
                          <p className="text-xs text-slate-500">{drive.wasteGB.toFixed(0)}GB waste</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Bitrate Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Bitrate</span>
                    <span className="text-white font-medium">{calculations.totalBitrate} Mbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Per Camera (avg)</span>
                    <span className="text-white font-medium">{(calculations.totalBitrate / cameras.length).toFixed(1)} Mbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Daily Write</span>
                    <span className="text-white font-medium">{calculations.totalDailyGB.toFixed(2)} GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}