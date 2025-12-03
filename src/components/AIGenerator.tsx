import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/lib/mock-auth';
import type { AIGeneration, Project } from '@shared/types';interface BadgeProps {children?: React.ReactNode;className?: string;style?: React.CSSProperties;[key: string]: unknown;}interface BadgeProps {children?: React.ReactNode;className?: string;style?: React.CSSProperties;[key: string]: unknown;}interface control {id?: string | number;[key: string]: unknown;}interface ControllerProps {children?: React.ReactNode;className?: string;style?: React.CSSProperties;[key: string]: unknown;}interface control {id?: string | number;[key: string]: unknown;}interface ControllerProps {children?: React.ReactNode;className?: string;style?: React.CSSProperties;[key: string]: unknown;}
interface AIGeneratorProps {
  onGenerate: () => void;
}
export function AIGenerator({ onGenerate }: AIGeneratorProps) {
  const navigate = useNavigate();
  const currentOrg = useAuthStore((s) => s.currentOrg);
  const [history, setHistory] = useState<AIGeneration[]>([]);
  useEffect(() => {
    if (currentOrg) {
      try {
        const saved = localStorage.getItem(`ai_history_${currentOrg.id}`);
        setHistory(saved ? JSON.parse(saved) : []);
      } catch {
        setHistory([]);
      }
    }
  }, [currentOrg]);
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      prompt: 'A simple lead capture funnel for a real estate agency.',
      type: 'funnel',
      industry: 'real-estate'
    }
  });
  const generateMutation = useMutation({
    mutationFn: (data: {prompt: string;type: string;}) =>
    api('/api/ai/templates', {
      method: 'POST',
      body: JSON.stringify({ ...data, orgId: currentOrg?.id })
    }),
    onSuccess: (data: any) => {
      toast.success('Project generated successfully!');
      const newHistoryItem: AIGeneration = { id: data.id, prompt: watch('prompt'), type: watch('type'), output: data, orgId: currentOrg!.id, timestamp: Date.now() };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      if (currentOrg) {
        localStorage.setItem(`ai_history_${currentOrg.id}`, JSON.stringify(updatedHistory));
      }
      onGenerate();
      navigate('/app/projects');
    },
    onError: (error: Error) => toast.error(`Generation failed: ${error.message}`)
  });
  const onSubmit = (data: {prompt: string;type: string;industry: string;}) => {
    const fullPrompt = `Full project: ${data.prompt}. Industry: ${data.industry}. Include ${data.type} structure.`;
    generateMutation.mutate({ prompt: fullPrompt, type: data.type });
  };
  return (
    <div className="py-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate with AI</CardTitle>
          <CardDescription>Describe the project you want to create, and our AI will build a starting template for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="type">What do you want to create?</Label>
              <Controller name="type" control={control} render={({ field }) =>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funnel">Funnel</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="page">Landing Page</SelectItem>
                  </SelectContent>
                </Select>
              } />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Controller name="industry" control={control} render={({ field }) =>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="e-commerce">E-commerce</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              } />
            </div>
            <div>
              <Label htmlFor="prompt">Describe your project</Label>
              <Textarea
                id="prompt"
                rows={5}
                placeholder="e.g., A 3-step funnel for a webinar registration, including a thank you page and a follow-up email sequence."
                {...register('prompt')} />

            </div>
            <Button type="submit" className="w-full" disabled={generateMutation.isPending}>
              {generateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </form>
        </CardContent>
      </Card>
      {history.length > 0 &&
      <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Generations</h3>
          {history.map((item) =>
        <Card key={item.id} className="p-3">
              <p className="font-semibold truncate text-sm">{item.prompt}</p>
              <div className="flex justify-between items-center mt-1">
                <Badge variant="outline" className="capitalize">{item.type}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </Card>
        )}
        </div>
      }
    </div>);

}