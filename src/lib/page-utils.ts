import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageElement } from '@shared/types';
export const GenericElement = ({ data }: { data: PageElement }) => {
  switch (data.type) {
    case 'text':
      return <div className="p-2 border border-dashed rounded">{data.content || 'Text Element'}</div>;
    case 'image':
      return (
        <div className="p-2 border border-dashed rounded">
          {data.content ? <img src={data.content} alt="placeholder" className="max-w-full" /> : 'Image Element'}
        </div>
      );
    case 'button':
      return <Button>{data.content || 'Button'}</Button>;
    case 'form':
      return (
        <Card className="p-4">
          <CardContent className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="your@email.com" />
            <Button className="w-full">Submit</Button>
          </CardContent>
        </Card>
      );
    default:
      return <div className="p-2 border border-dashed rounded">{data.type}</div>;
  }
};