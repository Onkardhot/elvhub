'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Send,
  Sparkles,
  Clock,
  ThumbsUp,
  Copy,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  'How to calculate CCTV camera count for a warehouse?',
  'Best practices for access control system design',
  'Fire alarm zone mapping guidelines',
  'BMS integration protocols explained',
];

const suggestedTopics = [
  { label: 'CCTV Design', count: '1.2k' },
  { label: 'Access Control', count: '890' },
  { label: 'Fire Alarm', count: '756' },
  { label: 'Networking', count: '654' },
  { label: 'Troubleshooting', count: '543' },
  { label: 'BOQ Templates', count: '432' },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your ELV & BMS AI assistant. I can help you with technical questions, system design, troubleshooting, and best practices. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulated AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Based on your query about ELV & BMS systems, here are my recommendations:\n\n1. Start with a thorough site survey to understand the environment\n2. Consider future scalability when selecting equipment\n3. Follow relevant standards (EN 50130, BS 5839, etc.)\n4. Ensure proper documentation for maintenance\n\nWould you like me to elaborate on any of these points?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <DashboardLayout title="AI Assistant">
      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="bg-slate-900/50 border-slate-800 flex-1 flex flex-col min-h-0">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                AI Assistant
                <Badge className="ml-2 bg-green-600">Online</Badge>
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-4',
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-100'
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className={cn('w-3 h-3', msg.role === 'user' ? 'text-blue-200' : 'text-slate-500')} />
                      <span className={cn('text-xs', msg.role === 'user' ? 'text-blue-200' : 'text-slate-500')}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => copyMessage(msg.content)}
                          className="ml-2 p-1 rounded hover:bg-slate-700 transition-colors"
                        >
                          <Copy className="w-3 h-3 text-slate-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-white">JD</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input Area */}
            <div className="border-t border-slate-800 p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Describe your problem or question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="min-h-[60px] max-h-[120px]"
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 shrink-0"
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInputValue(prompt)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Suggested Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedTopics.map((topic) => (
                <button
                  key={topic.label}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
                >
                  <span className="text-sm text-slate-300">{topic.label}</span>
                  <Badge variant="outline" className="border-slate-700 text-slate-500 text-xs">
                    {topic.count}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                AI Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Be specific about your project type and requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Include equipment brands for targeted advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Ask follow-up questions for detailed solutions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}