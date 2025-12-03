import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { Funnel } from '@shared/types';
interface FunnelSequencerProps {
  funnel: Funnel;
}
export function FunnelSequencer({ funnel }: FunnelSequencerProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Funnel Steps</h3>
      <div className="flex items-center gap-4 overflow-x-auto">
        {funnel.steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <Card className="w-48 flex-shrink-0">
              <CardHeader>
                <CardTitle className="text-base">Step {step.order}: Page {step.pageId.slice(0, 4)}</CardTitle>
              </CardHeader>
            </Card>
            {index < funnel.steps.length - 1 && <ArrowRight className="h-6 w-6 text-muted-foreground" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}