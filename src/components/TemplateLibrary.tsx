import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { EmailTemplate, SMSTemplate, Page } from '@shared/types';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
const fetchEmailTemplates = async () => api<{ items: EmailTemplate[] }>('/api/templates/email');
const fetchSmsTemplates = async () => api<{ items: SMSTemplate[] }>('/api/templates/sms');
const fetchPageTemplates = async () => api<{ items: Page[] }>('/api/pages/templates');
interface TemplateLibraryProps {
  type: 'email' | 'sms' | 'page';
  onSelect: (id: string) => void;
}
export function TemplateLibrary({ type, onSelect }: TemplateLibraryProps) {
  const queryFn = () => {
    switch (type) {
      case 'email': return fetchEmailTemplates();
      case 'sms': return fetchSmsTemplates();
      case 'page': return fetchPageTemplates();
      default: return Promise.resolve({ items: [] });
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: [`${type}Templates`],
    queryFn,
  });
  const templates = (data?.items ?? []) as Array<EmailTemplate | SMSTemplate | Page>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
        ) : (
          templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02, y: -2 }}
              className="cursor-pointer"
              onClick={() => onSelect(template.id)}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline" className="capitalize">{type}</Badge>
                  </div>
                  {'subject' in template && <CardDescription>{template.subject}</CardDescription>}
                </CardHeader>
                <CardContent>
                  {'body' in template && template.body ? (
                    <div className={cn("text-sm text-muted-foreground line-clamp-2")} dangerouslySetInnerHTML={{ __html: template.body }} />
                  ) : 'content' in template ? (
                     <div className={cn("text-sm text-muted-foreground line-clamp-2")}>Page template with {template.content.length} elements.</div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No content preview.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}