'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  Search,
  Filter,
  ExternalLink,
  FileText,
  Camera,
  Server,
  Lock,
  Flame,
  Speaker,
  HardDrive,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatasheetItem {
  id: string;
  manufacturer: string;
  model: string;
  category: string;
  type: string;
  resolution: string | null;
  specs: Record<string, string>;
  datasheetUrl: string;
}

const categoryIcons: Record<string, typeof Camera> = {
  'CCTV': Camera,
  'Fire Alarm': Flame,
  'Access Control': Lock,
  'Networking': Server,
  'Public Address': Speaker,
};

export default function DatasheetBrowserPage() {
  const [items, setItems] = useState<DatasheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchDatasheets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedManufacturer) params.set('manufacturer', selectedManufacturer);

      const response = await fetch(`/api/datasheet?${params.toString()}`);
      const data = await response.json();

      setItems(data.results || []);
      setManufacturers(data.manufacturers || []);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch datasheets:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedManufacturer]);

  useEffect(() => {
    const debounce = setTimeout(fetchDatasheets, 300);
    return () => clearTimeout(debounce);
  }, [fetchDatasheets]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedManufacturer('');
  };

  return (
    <DashboardLayout title="Datasheet Browser">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Datasheet Browser
            </CardTitle>
            <CardDescription className="text-slate-400">
              Search and browse technical datasheets for ELV equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search by model, manufacturer, or specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                options={[{ value: '', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48"
              />
              <Select
                options={[{ value: '', label: 'All Manufacturers' }, ...manufacturers.map((m) => ({ value: m, label: m }))]}
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="w-full sm:w-48"
              />
              {(searchQuery || selectedCategory || selectedManufacturer) && (
                <Button variant="outline" className="border-slate-700" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory && (
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  {selectedCategory}
                </Badge>
              )}
              {selectedManufacturer && (
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  {selectedManufacturer}
                </Badge>
              )}
              <span className="text-sm text-slate-500 ml-auto">
                {items.length} results
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Category Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            size="sm"
            className={selectedCategory === '' ? 'bg-blue-600' : 'border-slate-700'}
            onClick={() => setSelectedCategory('')}
          >
            All
          </Button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Camera;
            return (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === cat ? 'bg-blue-600' : 'border-slate-700'}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              >
                <Icon className="w-4 h-4 mr-1" />
                {cat}
              </Button>
            );
          })}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-800 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-slate-800 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">No datasheets found matching your criteria</p>
              <Button variant="outline" className="mt-4 border-slate-700" onClick={clearFilters}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => {
              const CategoryIcon = categoryIcons[item.category] || Camera;
              const isExpanded = expandedId === item.id;

              return (
                <Card key={item.id} className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-slate-800 shrink-0">
                        <CategoryIcon className="w-6 h-6 text-blue-500" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white">{item.manufacturer}</h3>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {item.model}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                              <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                                {item.category}
                              </Badge>
                              <Badge className="bg-slate-700 text-slate-300">
                                {item.type}
                              </Badge>
                              {item.resolution && (
                                <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                                  {item.resolution}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-700"
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                  Specs
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-700"
                              asChild
                            >
                              <a href={item.datasheetUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Datasheet
                              </a>
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Specs */}
                        {isExpanded && (
                          <div className="mt-4 p-4 rounded-lg bg-slate-800/50">
                            <h4 className="text-sm font-medium text-white mb-3">Technical Specifications</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {Object.entries(item.specs).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <p className="text-slate-400 text-xs">{key}</p>
                                  <p className="text-slate-200">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}