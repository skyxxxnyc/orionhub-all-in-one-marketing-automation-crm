import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Import } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ReportingDashboard } from "@/components/ReportingDashboard";
import { AgencyReport } from "@/components/AgencyReport";
import { useAuthStore } from "@/lib/mock-auth";
import { OnboardingTooltip } from "@/components/OnboardingTooltip";
import React from "react";
export function Dashboard() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const isAgency = currentOrg?.type === 'agency';
  React.useEffect(() => {
    // In a real app, you'd trigger a tour here based on user state
    // e.g., if (!localStorage.getItem('tour-seen')) { startTour(); }
  }, []);
  return (
    <div className="max-w-full mx-auto">
      <div className="py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's a snapshot of your business.</p>
          </div>
          <div className="flex gap-2">
            <OnboardingTooltip tourId="add-contact-btn" content="Quickly add a new contact from here.">
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Contact</Button>
            </OnboardingTooltip>
            <Button variant="outline"><Import className="mr-2 h-4 w-4" /> Import CSV</Button>
          </div>
        </div>
      </div>
      <ResizablePanelGroup direction="vertical" className="min-h-[600px] rounded-lg border">
        <ResizablePanel defaultSize={isAgency ? 50 : 100}>
          <div className="p-4 sm:p-6 h-full overflow-auto">
            <ReportingDashboard />
          </div>
        </ResizablePanel>
        {isAgency && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="p-4 sm:p-6 h-full overflow-auto">
                <h2 className="text-2xl font-bold mb-4">Agency Overview</h2>
                <AgencyReport />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}