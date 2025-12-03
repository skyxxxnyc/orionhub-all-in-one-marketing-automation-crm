import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export function PopupBuilder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popup Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Popup Content</Label>
          <Input placeholder="e.g., Get 10% off!" />
        </div>
        <div>
          <Label>Trigger</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exit-intent">Exit Intent</SelectItem>
              <SelectItem value="time">Time on Page</SelectItem>
              <SelectItem value="scroll">Scroll Depth</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Save Popup</Button>
      </CardContent>
    </Card>
  );
}