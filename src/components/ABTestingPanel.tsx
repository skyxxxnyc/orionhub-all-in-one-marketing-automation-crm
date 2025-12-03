import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
export function ABTestingPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>A/B Testing</CardTitle>
        <CardDescription>Create variants to test and optimize your page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Traffic Split</Label>
          <div className="flex items-center gap-4">
            <span>A: 50%</span>
            <Slider defaultValue={[50]} max={100} step={1} />
            <span>B: 50%</span>
          </div>
        </div>
        <Button>Create Variant B</Button>
      </CardContent>
    </Card>
  );
}