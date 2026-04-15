'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  FileText,
  FileSpreadsheet,
  BookOpen,
  Search,
  Filter,
  Calendar,
  HardDrive,
  ExternalLink,
  Star,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: 'boq-template' | 'datasheet' | 'standard' | 'guide';
  fileName: string;
  fileSize: string;
  fileType: 'PDF' | 'XLSX' | 'DOCX';
  downloadUrl: string;
  createdAt: Date;
  downloads: number;
  featured?: boolean;
}

const mockDownloads: DownloadItem[] = [
  {
    id: '1',
    title: 'Commercial Building BOQ Template',
    description: 'Comprehensive Bill of Quantities template for commercial ELV projects including CCTV, access control, fire alarm, and BMS systems.',
    category: 'boq-template',
    fileName: 'ELV_BOQ_Commercial_Template.xlsx',
    fileSize: '2.4 MB',
    fileType: 'XLSX',
    downloadUrl: '#',
    createdAt: new Date('2026-01-15'),
    downloads: 1234,
    featured: true,
  },
  {
    id: '2',
    title: 'CCTV Camera Specifications Guide',
    description: 'Technical specifications and comparison guide for popular CCTV camera brands including Hikvision, Dahua, and Axis.',
    category: 'datasheet',
    fileName: 'CCTV_Camera_Specs_Guide.pdf',
    fileSize: '5.1 MB',
    fileType: 'PDF',
    downloadUrl: '#',
    createdAt: new Date('2026-02-20'),
    downloads: 892,
  },
  {
    id: '3',
    title: 'EN 50130 Standard Summary',
    description: 'Quick reference guide for EN 50130 series standards related to CCTV and access control systems.',
    category: 'standard',
    fileName: 'EN50130_Summary.pdf',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    downloadUrl: '#',
    createdAt: new Date('2026-03-01'),
    downloads: 567,
  },
  {
    id: '4',
    title: 'BMS Integration Protocol Handbook',
    description: 'Complete guide to BACnet, Modbus, and other BMS integration protocols with practical examples.',
    category: 'guide',
    fileName: 'BMS_Integration_Handbook.pdf',
    fileSize: '8.7 MB',
    fileType: 'PDF',
    downloadUrl: '#',
    createdAt: new Date('2026-03-10'),
    downloads: 743,
    featured: true,
  },
  {
    id: '5',
    title: 'Access Control BOQ Template',
    description: 'Bill of quantities template specifically designed for access control system projects.',
    category: 'boq-template',
    fileName: 'Access_Control_BOQ_Template.xlsx',
    fileSize: '1.8 MB',
    fileType: 'XLSX',
    downloadUrl: '#',
    createdAt: new Date('2026-02-28'),
    downloads: 456,
  },
  {
    id: '6',
    title: 'Fire Alarm Design Best Practices',
    description: 'Technical guide covering fire alarm system design, zone planning, and device placement.',
    category: 'guide',
    fileName: 'Fire_Alarm_Design_Guide.pdf',
    fileSize: '4.3 MB',
    fileType: 'PDF',
    downloadUrl: '#',
    createdAt: new Date('2026-01-25'),
    downloads: 678,
  },
];

const categories = [
  { value: 'all', label: 'All Files' },
  { value: 'boq-template', label: 'BOQ Templates' },
  { value: 'datasheet', label: 'Datasheets' },
  { value: 'standard', label: 'Standards' },
  { value: 'guide', label: 'Guides' },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'boq-template': return FileSpreadsheet;
    case 'datasheet': return FileText;
    case 'standard': return BookOpen;
    default: return FileText;
  }
};

const getFileTypeBadgeColor = (fileType: string) => {
  switch (fileType) {
    case 'PDF': return 'bg-red-600';
    case 'XLSX': return 'bg-green-600';
    case 'DOCX': return 'bg-blue-600';
    default: return 'bg-slate-600';
  }
};

export default function DownloadsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDownloads = mockDownloads.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout title="Downloads">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Download Center</h2>
            <p className="text-slate-400 text-sm mt-1">BOQ templates, datasheets, and technical guides</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-slate-700 text-slate-300">
              {mockDownloads.length} files
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Section */}
        {!searchQuery && selectedCategory === 'all' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Featured Downloads
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {mockDownloads.filter((d) => d.featured).map((item) => (
                <Card key={item.id} className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-600/20">
                        <FileSpreadsheet className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {item.fileSize}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Downloads */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedCategory === 'all' ? 'All Downloads' : categories.find((c) => c.value === selectedCategory)?.label}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDownloads.filter((d) => !d.featured || searchQuery || selectedCategory !== 'all').map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              return (
                <Card key={item.id} className="bg-slate-900/50 border-slate-800 hover:border-blue-500/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-slate-800">
                        <CategoryIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <Badge className={getFileTypeBadgeColor(item.fileType)}>{item.fileType}</Badge>
                    </div>
                    <h4 className="font-semibold text-white mb-2 line-clamp-1">{item.title}</h4>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {item.fileSize}
                      </span>
                      <span>{item.downloads.toLocaleString()} downloads</span>
                    </div>
                    <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800" asChild>
                      <a href={item.downloadUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}