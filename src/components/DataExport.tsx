import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { MOCK_CONTACTS, MOCK_DEALS } from '@shared/mock-data';
export function DataExport() {
  const [entity, setEntity] = React.useState('contacts');
  const handleExport = () => {
    let data: any[] = [];
    if (entity === 'contacts') data = MOCK_CONTACTS;
    if (entity === 'deals') data = MOCK_DEALS;
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${entity}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${entity} exported successfully.`);
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
                <SelectItem value="campaigns">Campaigns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExport} className="w-full">
            Download CSV
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}