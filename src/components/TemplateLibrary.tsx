import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { EmailTemplate, SMSTemplate, Page, Funnel } from '@shared/types';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { useAuthStore } from '@/lib/mock-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const fetchTemplates = async (type: 'email' | 'sms' | 'page' | 'funnel') => {
  let endpoint = '';
  switch (type) {
    case 'email': endpoint = '/api/templates/email'; break;
    case 'sms': endpoint = '/api/templates/sms'; break;
    case 'page': endpoint = '/api/pages/templates'; break;
    case 'funnel': endpoint = '/api/funnels/templates'; break;
    default: return { items: [] };
  }
  return api<{ items: any[] }>(endpoint);
};
interface TemplateLibraryProps {
  type: 'email' | 'sms' | 'page' | 'funnel';
  onSelect: (id: string) => void;
}
export function TemplateLibrary({ type, onSelect }: TemplateLibraryProps) {
  const { data, isLoading } = useQuery({
    queryKey: [`${type}Templates`],
    queryFn: () => fetchTemplates(type),
  });
  const templates = (data?.items ?? []) as Array<EmailTemplate | SMSTemplate | Page | Funnel>;
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
                  {'description' in template && <CardDescription className="line-clamp-2">{template.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  {'body' in template && template.body ? (
                    <div className={cn("text-sm text-muted-foreground line-clamp-2")} dangerouslySetInnerHTML={{ __html: template.body }} />
                  ) : 'content' in template ? (
                     <div className={cn("text-sm text-muted-foreground line-clamp-2")}>Page template with {template.content.length} elements.</div>
                  ) : 'steps' in template ? (
                    <div className="text-sm text-muted-foreground">
                      <Badge>{template.steps.length} Steps</Badge>
                      <p className="mt-2 truncate">{template.steps.map(s => s.pageId).join(' → ')}</p>
                    </div>
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