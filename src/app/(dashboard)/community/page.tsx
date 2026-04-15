'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Plus,
  Search,
  Filter,
  TrendingUp,
  HelpCircle,
  Briefcase,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'all', label: 'All', icon: Filter },
  { value: 'question', label: 'Questions', icon: HelpCircle },
  { value: 'discussion', label: 'Discussions', icon: Users },
  { value: 'project', label: 'Projects', icon: Briefcase },
  { value: 'general', label: 'General', icon: TrendingUp },
];

const mockPosts = [
  {
    id: '1',
    title: 'Best practices for CCTV camera positioning in long corridors',
    content: 'I am designing a CCTV system for a 50m long corridor. What is the optimal camera spacing and positioning strategy? Should I use panoramic cameras or multiple fixed cameras?',
    category: 'question',
    tags: ['CCTV', 'Camera Placement', 'Design'],
    author: { name: 'Ahmed Hassan', fallback: 'AH' },
    upvotes: 24,
    answers: 8,
    views: 156,
    timeAgo: '2 hours ago',
  },
  {
    id: '2',
    title: 'Integration of Access Control with Fire Alarm System - Technical Guide',
    content: 'I have compiled a comprehensive guide on how to integrate access control systems with fire alarm panels. This includes the接线 diagrams and programming guidelines.',
    category: 'discussion',
    tags: ['Access Control', 'Fire Alarm', 'Integration'],
    author: { name: 'Sarah Chen', fallback: 'SC' },
    upvotes: 56,
    answers: 12,
    views: 423,
    timeAgo: '1 day ago',
  },
  {
    id: '3',
    title: 'New Office Tower Project - BOQ Review Request',
    content: 'Looking for feedback on my BOQ for a 25-floor office building. It includes CCTV, access control, fire alarm, BMS, and public address systems.',
    category: 'project',
    tags: ['BOQ', 'Project', 'Commercial'],
    author: { name: 'Marcus Weber', fallback: 'MW' },
    upvotes: 18,
    answers: 5,
    views: 89,
    timeAgo: '3 days ago',
  },
  {
    id: '4',
    title: 'Understanding ONVIF protocol for CCTV integration',
    content: 'Can someone explain the basics of ONVIF protocol and how it simplifies CCTV system integration? What are the key points to check for compatibility?',
    category: 'question',
    tags: ['ONVIF', 'CCTV', 'Networking'],
    author: { name: 'Priya Sharma', fallback: 'PS' },
    upvotes: 31,
    answers: 6,
    views: 234,
    timeAgo: '5 days ago',
  },
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const filteredPosts = mockPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'question': return HelpCircle;
      case 'discussion': return Users;
      case 'project': return Briefcase;
      default: return TrendingUp;
    }
  };

  return (
    <DashboardLayout title="Community">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Engineer Community</h2>
            <p className="text-slate-400 text-sm mt-1">Share knowledge, ask questions, collaborate</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewPost(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="Share your question, project, or discussion..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">Publish Post</Button>
                <Button variant="outline" onClick={() => setShowNewPost(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const CategoryIcon = getCategoryIcon(post.category);
            return (
              <Card key={post.id} className="bg-slate-900/50 border-slate-800 hover:border-blue-500/30 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <Avatar fallback={post.author.fallback} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-slate-700 text-slate-300">
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {post.category}
                          </Badge>
                          <span className="text-xs text-slate-500">{post.timeAgo}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{post.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-3">{post.content}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-slate-700 text-slate-400 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.upvotes}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.answers} answers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>{post.views} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}