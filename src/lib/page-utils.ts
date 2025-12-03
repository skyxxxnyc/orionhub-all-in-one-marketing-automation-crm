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
export function generateMetaTags(seo: { title: string; description: string; image?: string }) {
  let tags = `<title>${seo.title}</title>\n`;
  tags += `<meta name="description" content="${seo.description}">\n`;
  if (seo.image) {
    tags += `<meta property="og:image" content="${seo.image}">\n`;
  }
  return tags;
}
export function generateEmbedCode(pageId: string) {
  return `<iframe src="${window.location.origin}/p/${pageId}" style="width:100%;height:500px;border:0;"></iframe>`;
}