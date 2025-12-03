import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, BookOpen, HelpCircle, Video, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/mock-auth';
import { SupportTicketSystem } from '@/components/SupportTicketSystem';
import { useDebounce } from 'react-use';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Article } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const fetchArticles = async (role?: string) => api<{ items: Article[] }>('/api/articles', { query: { role } });
export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const user = useAuthStore(s => s.user);
  const role = useAuthStore(s => s.role);
  const { data, isLoading } = useQuery({
    queryKey: ['articles', role],
    queryFn: () => fetchArticles(role),
    enabled: !!role,
  });
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 300, [searchTerm]);
  const filteredArticles = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(article =>
      (topicFilter === 'all' || article.category === topicFilter) &&
      (article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || article.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
  }, [debouncedSearchTerm, data, topicFilter]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="text-center mb-20">
          <h1 className="editorial-heading">Help Center</h1>
          <p className="mt-6 text-2xl font-mono uppercase font-bold text-muted-foreground max-w-3xl mx-auto">
            Self-Service Support & Documentation.
          </p>
          <div className="mt-12 relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-black" />
            <Input
              placeholder="SEARCH DOCUMENTATION..."
              className="brutalist-input pl-14 h-16 text-xl font-black uppercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-orange-500" /> Knowledge Base
                </h2>
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className="brutalist-input w-[200px] h-10 font-black uppercase text-xs">
                    <SelectValue placeholder="FILTER TOPIC" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none shadow-brutalist">
                    <SelectItem value="all" className="font-black uppercase text-xs">ALL TOPICS</SelectItem>
                    <SelectItem value="integrations" className="font-black uppercase text-xs">INTEGRATIONS</SelectItem>
                    <SelectItem value="setup" className="font-black uppercase text-xs">SETUP</SelectItem>
                    <SelectItem value="automations" className="font-black uppercase text-xs">AUTOMATIONS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-6">
                {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full border-4 border-black" />) :
                filteredArticles.map(article => (
                  <motion.div key={article.id} whileHover={{ x: 8 }}>
                    <div className="brutalist-card bg-white group cursor-pointer">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black uppercase group-hover:text-orange-500 transition-colors">{article.title}</h3>
                        <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-muted-foreground line-clamp-2 font-mono uppercase">
                        {article.category} • {article.content.length} characters
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 mb-8">
                <HelpCircle className="h-8 w-8 text-orange-500" /> FAQ
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                  { q: "HOW DO I CONNECT STRIPE?", a: "Go to Settings > Billing and click 'Connect Stripe'. Follow the OAuth flow to link your account." },
                  { q: "CAN I EXPORT MY DATA?", a: "Yes, use the 'Export Data' button in the Reporting or Settings sections to download CSV/JSON backups." },
                  { q: "WHAT IS THE API LIMIT?", a: "Pro plans have a limit of 10,000 requests per day. Enterprise plans are unlimited." }
                ].map((faq, i) => (
                  <AccordionItem value={`item-${i}`} key={i} className="border-4 border-black bg-white px-4">
                    <AccordionTrigger className="font-black uppercase text-sm hover:no-underline">{faq.q}</AccordionTrigger>
                    <AccordionContent className="font-medium text-muted-foreground pb-4">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
          <div className="space-y-12">
            <section>
              <SupportTicketSystem articles={data?.items} />
            </section>
            <section>
              <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 mb-8">
                <Video className="h-8 w-8 text-orange-500" /> Tutorials
              </h2>
              <div className="space-y-6">
                {[
                  "Mastering Automations",
                  "Pipeline Management 101",
                  "Agency White-labeling"
                ].map(title => (
                  <div key={title} className="brutalist-card bg-black text-white group cursor-pointer">
                    <div className="aspect-video bg-orange-500 border-2 border-white mb-4 flex items-center justify-center">
                      <Video className="h-12 w-12 text-black" />
                    </div>
                    <h3 className="text-lg font-black uppercase">{title}</h3>
                    <p className="text-[10px] font-mono uppercase mt-2 opacity-60">12:45 • Intermediate</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}