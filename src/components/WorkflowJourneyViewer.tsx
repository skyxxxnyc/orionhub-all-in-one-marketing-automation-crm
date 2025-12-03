import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ArrowRight } from 'lucide-react';
import { MOCK_WORKFLOWS } from '@shared/mock-data';
export function WorkflowJourneyViewer() {
  const journey = MOCK_WORKFLOWS[0].nodes;
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Contact Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex items-center gap-4 p-4">
              {journey.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div className="p-3 border rounded-lg text-center w-40 flex-shrink-0">
                    <p className="font-semibold text-sm">{node.data.label}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  {index < journey.length - 1 && <ArrowRight className="h-5 w-5 text-muted-foreground" />}
                </React.Fragment>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}