import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { EmailTemplate, SMSTemplate } from '@shared/types';
import { cn } from '@/lib/utils';
const fetchEmailTemplates = async () => api<{ items: EmailTemplate[] }>('/api/templates/email');
const fetchSmsTemplates = async () => api<{ items: SMSTemplate[] }>('/api/templates/sms');
interface TemplateLibraryProps {
  type: 'email' | 'sms';
  onSelect: (id: string) => void;
}
export function TemplateLibrary({ type, onSelect }: TemplateLibraryProps) {
  const { data, isLoading } = useQuery({
    queryKey: [type === 'email' ? 'emailTemplates' : 'smsTemplates'],
    queryFn: type === 'email' ? fetchEmailTemplates : fetchSmsTemplates,
  });
  const templates = (data?.items ?? []) as Array<EmailTemplate | SMSTemplate>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
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
                {template.body ? (
                  <div className={cn("text-sm text-muted-foreground line-clamp-2")}>{template.body}</div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No content preview.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}