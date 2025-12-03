import React from 'react';
import { NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageElement } from '@shared/types';
// This file would contain the visual representation of each node type in the page editor.
// For simplicity in this phase, we'll use a generic renderer. A full implementation
// would have specific components for Heading, Text, Image, etc.
const GenericElement = ({ data }: { data: PageElement }) => {
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
export const PageElementNode = ({ data }: NodeProps<PageElement>) => {
  return (
    <div>
      <GenericElement data={data} />
    </div>
  );
};
export const PageElementTypes = {
  text: PageElementNode,
  image: PageElementNode,
  form: PageElementNode,
  button: PageElementNode,
  section: PageElementNode,
};