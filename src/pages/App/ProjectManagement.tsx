import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { ProjectDashboard } from '@/components/ProjectDashboard';
import { TemplateGallery } from '@/components/TemplateGallery';
import { AIGenerator } from '@/components/AIGenerator';
export function ProjectManagement() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
            <p className="text-muted-foreground">Organize, create, and manage all your projects.</p>
          </div>
          <OnboardingTooltip tourId="new-project" content="Create a new project from a template or with AI.">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Project</Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-4xl w-full">
                <SheetHeader>
                  <SheetTitle>Create a New Project</SheetTitle>
                </SheetHeader>
                <Tabs defaultValue="templates" className="py-4">
                  <TabsList>
                    <TabsTrigger value="templates">From Template</TabsTrigger>
                    <TabsTrigger value="ai">With AI</TabsTrigger>
                  </TabsList>
                  <TabsContent value="templates">
                    <TemplateGallery onSelect={() => setSheetOpen(false)} />
                  </TabsContent>
                  <TabsContent value="ai">
                    <AIGenerator onGenerate={() => setSheetOpen(false)} />
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          </OnboardingTooltip>
        </div>
        <ProjectDashboard />
      </div>
    </div>
  );
}