import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
export function FormBuilder() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    toast.success('Form submitted (mock)');
    console.log(data);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email Field</Label>
            <Input {...register('email')} type="email" placeholder="Email" />
          </div>
          <div>
            <Label>Name Field</Label>
            <Input {...register('name')} placeholder="Name" />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}