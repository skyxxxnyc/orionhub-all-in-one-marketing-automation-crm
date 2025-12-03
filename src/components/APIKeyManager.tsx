import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Copy, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { APIKey } from '@shared/types';
const fetchApiKeys = async () => api<{ items: APIKey[] }>('/api/apikeys');
export function APIKeyManager() {
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = React.useState<string | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['apiKeys'], queryFn: fetchApiKeys });
  const generateMutation = useMutation({
    mutationFn: () => api<APIKey>('/api/apikeys', { method: 'POST' }),
    onSuccess: (key) => {
      setNewKey(key.key);
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
    onError: () => toast.error('Failed to generate API key.'),
  });
  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      toast.success('API Key copied to clipboard!');
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for custom integrations.</CardDescription>
            </div>
            <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
              <PlusCircle className="mr-2 h-4 w-4" /> Generate New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key (Prefix)</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
              ) : (
                data?.items.map(key => (
                  <TableRow key={key.id}>
                    <TableCell className="font-mono">{key.key.substring(0, 8)}...</TableCell>
                    <TableCell>
                      {key.permissions.map(p => <Badge key={p} variant="secondary">{p}</Badge>)}
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3" /> Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={!!newKey} onOpenChange={() => setNewKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New API Key Generated</DialogTitle>
            <DialogDescription>
              Please copy your new API key. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={newKey || ''} readOnly className="font-mono" />
            <Button type="button" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setNewKey(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}