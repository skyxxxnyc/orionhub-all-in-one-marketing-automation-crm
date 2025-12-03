import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TestTube2 } from 'lucide-react';
export function WorkflowABTesting() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>A/B Test Branch</CardTitle>
          <CardDescription>Create a variant to test performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Traffic Split</Label>
            <div className="flex items-center gap-4 mt-2">
              <span>A: 50%</span>
              <Slider defaultValue={[50]} max={100} step={1} />
              <span>B: 50%</span>
            </div>
          </div>
          <Button><TestTube2 className="mr-2 h-4 w-4" /> Create Variant B</Button>
        </CardContent>
      </Card>
    </div>
  );
}