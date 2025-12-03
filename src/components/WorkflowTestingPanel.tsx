import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Play, Pause, StopCircle, RefreshCw } from 'lucide-react';
import { MOCK_CONTACTS } from '@shared/mock-data';
import { toast } from 'sonner';
export function WorkflowTestingPanel() {
  const [isSimulating, setIsSimulating] = useState(false);
  const { register, handleSubmit } = useForm();
  const onRun = (data: any) => {
    setIsSimulating(true);
    toast.info(`Simulating workflow for ${MOCK_CONTACTS.find(c => c.id === data.contactId)?.name}...`);
    setTimeout(() => {
      toast.success('Simulation complete!');
      setIsSimulating(false);
    }, 3000);
  };
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold">Test Workflow</h3>
      <form onSubmit={handleSubmit(onRun)} className="space-y-4">
        <div>
          <Label>Select a Contact to Test</Label>
          <Select {...register('contactId')}>
            <SelectTrigger>
              <SelectValue placeholder="Select a contact" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CONTACTS.map(contact => (
                <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isSimulating}>
            <Play className="mr-2 h-4 w-4" /> {isSimulating ? 'Running...' : 'Run Test'}
          </Button>
        </div>
      </form>
      {isSimulating && (
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Pause className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><StopCircle className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
}