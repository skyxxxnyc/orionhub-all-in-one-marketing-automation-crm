import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { api } from '@/lib/api-client';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
export function DataExport() {
  const [entity, setEntity] = useState('contacts');
  const [format, setFormat] = useState('csv');
  const [progress, setProgress] = useState(0);
  const exportMutation = useMutation({
    mutationFn: (entityType: string) => api<any[]>(`/api/${entityType}/export`),
    onSuccess: (data) => {
      setProgress(50);
      let fileContent: string;
      let fileExtension: string;
      if (format === 'csv') {
        fileContent = Papa.unparse(data);
        fileExtension = 'csv';
      } else {
        fileContent = JSON.stringify(data, null, 2);
        fileExtension = 'json';
      }
      setProgress(75);
      const blob = new Blob([fileContent], { type: `text/${fileExtension};charset=utf-8;` });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${entity}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${entity} exported successfully.`);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    },
    onError: () => {
      toast.error(`Failed to export ${entity}.`);
      setProgress(0);
    },
  });
  const handleExport = () => {
    setProgress(10);
    exportMutation.mutate(entity);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Data</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Export Data</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label>Select data to export</Label>
            <Select value={entity} onValueChange={setEntity}>
              <SelectTrigger>
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contacts">Contacts</SelectItem>
                <SelectItem value="deals">Deals</SelectItem>
                <SelectItem value="workflows">Workflows</SelectItem>
                <SelectItem value="campaigns">Campaigns</SelectItem>
                <SelectItem value="appointments">Appointments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Format</Label>
            <RadioGroup defaultValue="csv" value={format} onValueChange={setFormat} className="flex space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="csv" id="csv" /><Label htmlFor="csv">CSV</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="json" id="json" /><Label htmlFor="json">JSON</Label></div>
            </RadioGroup>
          </div>
          {/* Date range picker could be added here */}
          <Button onClick={handleExport} className="w-full" disabled={exportMutation.isPending}>
            {exportMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download {format.toUpperCase()}
          </Button>
          {exportMutation.isPending && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">Exporting...</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}