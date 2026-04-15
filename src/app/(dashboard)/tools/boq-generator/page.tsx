'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Download,
  Calculator,
  Save,
  Copy,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface BOQItem {
  id: string;
  category: string;
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

const categories = [
  'CCTV',
  'Access Control',
  'Fire Alarm',
  'Public Address',
  'BMS',
  'Networking',
  'Fiber Optic',
  'UPS & Power',
  'Cable & Trunking',
  'Labor',
];

const itemTemplates: Record<string, { description: string; unit: string; unitPrice: number }[]> = {
  'CCTV': [
    { description: 'Network Camera (IP, 4MP, Dome)', unit: 'pcs', unitPrice: 450 },
    { description: 'Network Camera (IP, 4MP, Bullet)', unit: 'pcs', unitPrice: 420 },
    { description: 'Network Camera (IP, 8MP, PTZ)', unit: 'pcs', unitPrice: 1200 },
    { description: 'NVR (16 Channel, 4K)', unit: 'pcs', unitPrice: 1800 },
    { description: 'NVR (32 Channel, 4K)', unit: 'pcs', unitPrice: 2800 },
    { description: 'Hard Disk (8TB, Surveillance)', unit: 'pcs', unitPrice: 350 },
    { description: 'PoE Switch (24 Port)', unit: 'pcs', unitPrice: 650 },
    { description: 'Camera Mounting Bracket', unit: 'pcs', unitPrice: 45 },
    { description: 'Termination Box', unit: 'pcs', unitPrice: 25 },
  ],
  'Access Control': [
    { description: 'Card Reader (RFID)', unit: 'pcs', unitPrice: 180 },
    { description: 'Biometric Reader (Fingerprint)', unit: 'pcs', unitPrice: 450 },
    { description: 'Door Controller', unit: 'pcs', unitPrice: 380 },
    { description: 'Electric Lock (Strike)', unit: 'pcs', unitPrice: 120 },
    { description: 'Electromagnetic Lock', unit: 'pcs', unitPrice: 150 },
    { description: 'Exit Button', unit: 'pcs', unitPrice: 25 },
    { description: 'Door Sensor', unit: 'pcs', unitPrice: 35 },
    { description: 'Access Control Server Software', unit: 'license', unitPrice: 1500 },
  ],
  'Fire Alarm': [
    { description: 'Addressable Fire Panel (Zone)', unit: 'pcs', unitPrice: 2200 },
    { description: 'Smoke Detector (Addressable)', unit: 'pcs', unitPrice: 85 },
    { description: 'Heat Detector (Addressable)', unit: 'pcs', unitPrice: 75 },
    { description: 'Manual Call Point', unit: 'pcs', unitPrice: 45 },
    { description: 'Alarm Bell', unit: 'pcs', unitPrice: 65 },
    { description: 'Strobe Light', unit: 'pcs', unitPrice: 55 },
    { description: 'Sensor Base', unit: 'pcs', unitPrice: 15 },
    { description: 'Fire Alarm Cable (2x1.5)', unit: 'm', unitPrice: 3 },
  ],
  'Networking': [
    { description: 'Network Switch (48 Port, PoE+)', unit: 'pcs', unitPrice: 1200 },
    { description: 'Network Switch (24 Port, PoE+)', unit: 'pcs', unitPrice: 750 },
    { description: 'Router (Enterprise)', unit: 'pcs', unitPrice: 2500 },
    { description: 'Firewall', unit: 'pcs', unitPrice: 3500 },
    { description: 'Patch Panel (24 Port)', unit: 'pcs', unitPrice: 180 },
    { description: 'CAT6 Cable', unit: 'm', unitPrice: 2.5 },
    { description: 'Fiber Patch Cord (SC/LC)', unit: 'pcs', unitPrice: 35 },
    { description: 'Rack Cabinet (42U)', unit: 'pcs', unitPrice: 1200 },
  ],
};

export default function BOQGeneratorPage() {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState<BOQItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('CCTV');
  const [showTemplates, setShowTemplates] = useState(false);
  const [copied, setCopied] = useState(false);

  const addItem = () => {
    const newItem: BOQItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      itemCode: '',
      description: '',
      unit: 'pcs',
      quantity: 1,
      unitPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof BOQItem, value: string | number) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const addTemplateItem = (template: { description: string; unit: string; unitPrice: number }) => {
    const newItem: BOQItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      itemCode: `ELV-${selectedCategory.substring(0, 3).toUpperCase()}-${(items.length + 1).toString().padStart(3, '0')}`,
      description: template.description,
      unit: template.unit,
      quantity: 1,
      unitPrice: template.unitPrice,
    };
    setItems([...items, newItem]);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const categoryTotals = categories.reduce((acc, cat) => {
    acc[cat] = items
      .filter((item) => item.category === cat)
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    return acc;
  }, {} as Record<string, number>);

  const exportToCSV = () => {
    const headers = ['Item Code', 'Category', 'Description', 'Unit', 'Quantity', 'Unit Price', 'Total'];
    const rows = items.map((item) => [
      item.itemCode,
      item.category,
      item.description,
      item.unit,
      item.quantity.toString(),
      item.unitPrice.toString(),
      (item.quantity * item.unitPrice).toString(),
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'BOQ'}_Export.csv`;
    a.click();
  };

  const copyToClipboard = () => {
    const text = items.map((item) =>
      `${item.itemCode}\t${item.category}\t${item.description}\t${item.unit}\t${item.quantity}\t$${item.unitPrice}\t$${item.quantity * item.unitPrice}`
    ).join('\n');
    navigator.clipboard.writeText(`Item Code\tCategory\tDescription\tUnit\tQty\tUnit Price\tTotal\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout title="BOQ Generator">
      <div className="space-y-6">
        {/* Project Info */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-500" />
              Bill of Quantities Generator
            </CardTitle>
            <CardDescription className="text-slate-400">
              Create detailed BOQs for ELV & BMS projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Project Name</label>
                <Input
                  placeholder="e.g., Tower A - Office Fit-out"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Client Name</label>
                <Input
                  placeholder="e.g., ABC Corporation"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Selection & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Select
              options={categories.map((c) => ({ value: c, label: c }))}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-48"
            />
            <Button
              variant="outline"
              className="border-slate-700"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {showTemplates ? 'Hide' : 'Show'} Templates
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-700" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button variant="outline" className="border-slate-700" onClick={exportToCSV} disabled={items.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Item Templates */}
        {showTemplates && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Quick Add Templates - {selectedCategory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(itemTemplates[selectedCategory] || []).map((template, i) => (
                  <button
                    key={i}
                    onClick={() => addTemplateItem(template)}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-left transition-colors"
                  >
                    <div>
                      <p className="text-sm text-white">{template.description}</p>
                      <p className="text-xs text-slate-400">${template.unitPrice} / {template.unit}</p>
                    </div>
                    <Plus className="w-4 h-4 text-blue-500 shrink-0" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* BOQ Items Table */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">BOQ Items ({items.length})</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-400">Categories:</span>
                {categories.filter((c) => categoryTotals[c] > 0).map((cat) => (
                  <Badge key={cat} variant="outline" className="border-slate-700 text-slate-300">
                    {cat}: ${categoryTotals[cat].toLocaleString()}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">No items added yet</p>
                <p className="text-slate-500 text-sm">Add items manually or use templates above</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Item Code</th>
                      <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Category</th>
                      <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Description</th>
                      <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Unit</th>
                      <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Qty</th>
                      <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Unit Price</th>
                      <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Total</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800">
                        <td className="py-2 px-2">
                          <Input
                            placeholder="Code"
                            value={item.itemCode}
                            onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                            className="h-8 text-sm bg-slate-800/50"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={item.category}
                            onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                            className="h-8 text-sm rounded-md bg-slate-800/50 border border-slate-700 px-2 text-slate-100"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="h-8 text-sm bg-slate-800/50"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            placeholder="Unit"
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="h-8 text-sm w-20 bg-slate-800/50"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="h-8 text-sm w-20 bg-slate-800/50"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm w-28 bg-slate-800/50"
                          />
                        </td>
                        <td className="py-2 px-2 text-white font-medium">
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </td>
                        <td className="py-2 px-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-800/30">
                      <td colSpan={6} className="py-3 px-2 text-right font-semibold text-white">Grand Total:</td>
                      <td className="py-3 px-2 font-bold text-xl text-blue-400">
                        ${calculateTotal().toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary by Category */}
        {items.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Cost Summary by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.filter((c) => categoryTotals[c] > 0).map((cat) => (
                  <div key={cat} className="p-4 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">{cat}</p>
                    <p className="text-lg font-bold text-white">${categoryTotals[cat].toLocaleString()}</p>
                    <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (categoryTotals[cat] / calculateTotal()) * 100)}%` }}
                      />
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