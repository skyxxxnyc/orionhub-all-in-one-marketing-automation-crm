import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, BookOpen, HelpCircle, Video } from 'lucide-react';
import { useAuthStore } from '@/lib/mock-auth';
import { MOCK_ARTICLES } from '@shared/mock-data';
import { SupportTicketSystem } from '@/components/SupportTicketSystem';
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
export function HelpCenter() {
    const [searchTerm, setSearchTerm] = useState('');
    const user = useAuthStore(s => s.user);
    const role = useAuthStore(s => s.role);
    const filteredArticles = useMemo(() => {
        return MOCK_ARTICLES.filter(article =>
            (article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (article.role === 'all' || article.role === role)
        );
    }, [searchTerm, role]);
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
                            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><BookOpen /> Knowledge Base</h2>
                            <div className="space-y-4">
                                {filteredArticles.map(article => (
                                    <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <CardTitle>{article.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground line-clamp-2">{article.content}</p>
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
                    <div className="space-y-8">
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
                        <section>
                            <SupportTicketSystem />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}