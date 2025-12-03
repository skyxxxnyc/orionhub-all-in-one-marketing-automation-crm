import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
export function SEOPanel() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log('SEO Data:', data);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>Optimize your page for search engines.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" {...register('metaTitle')} />
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" {...register('metaDescription')} />
          </div>
          <Button type="submit">Save SEO Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
}