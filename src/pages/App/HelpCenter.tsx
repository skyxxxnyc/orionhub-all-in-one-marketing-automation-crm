import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, BookOpen, HelpCircle, Video } from 'lucide-react';
import { useAuthStore } from '@/lib/mock-auth';
import { SupportTicketSystem } from '@/components/SupportTicketSystem';
import { useDebounce } from 'react-use';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Article } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const faqs = [
    { title: "What is a workflow?", content: "A workflow is an automated sequence of actions, triggers, and conditions that you can set up to engage with your contacts." },
    { title: "How do I import contacts?", content: "You can import contacts via a CSV file from the Contacts page. Ensure your file has 'name' and 'email' columns." },
    { title: "Can I connect my own domain?", content: "Yes, you can connect a custom domain for your funnels and landing pages in the Funnels section." },
    { title: "How does billing work for agencies?", content: "Agencies can manage sub-accounts and billing directly from the Settings > Billing section." },
];
const tutorials = [
    { title: "Building Your First Funnel", videoId: "dQw4w9WgXcQ" },
    { title: "Creating an Email Campaign", videoId: "dQw4w9WgXcQ" },
    { title: "Managing Your Sales Pipeline", videoId: "dQw4w9WgXcQ" },
];
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
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-display">Help Center</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Welcome, {user?.name}! How can we help you today?
                    </p>
                    <div className="mt-6 relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-12 h-12 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen /> Knowledge Base</h2>
                                <Select value={topicFilter} onValueChange={setTopicFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Topics</SelectItem>
                                        <SelectItem value="integrations">Integrations</SelectItem>
                                        <SelectItem value="setup">Setup</SelectItem>
                                        <SelectItem value="automations">Automations</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4">
                                {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />) :
                                filteredArticles.map(article => (
                                    <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <CardTitle>{article.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: article.content.replace(/<pre>.*?<\/pre>/gs, '[Code Snippet]') }} />
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><HelpCircle /> Frequently Asked Questions</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, i) => (
                                    <AccordionItem value={`item-${i}`} key={i}>
                                        <AccordionTrigger>{faq.title}</AccordionTrigger>
                                        <AccordionContent>{faq.content}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    </div>
                    <div className="space-y-8 lg:col-span-1">
                         <section>
                           <SupportTicketSystem articles={data?.items} />
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Video /> Tutorials</h2>
                            <div className="space-y-4">
                                {tutorials.map(tutorial => (
                                    <Card key={tutorial.title}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                                <p className="text-muted-foreground">Video Placeholder</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}