import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Import } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ReportingDashboard } from "@/components/ReportingDashboard";
import { AgencyReport } from "@/components/AgencyReport";
import { useAuthStore } from "@/lib/mock-auth";
import { OnboardingTooltip } from "@/components/OnboardingTooltip";
import React from "react";
import { motion } from "framer-motion";
import { DataExport } from "@/components/DataExport";
export function Dashboard() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const isAgency = currentOrg?.type === 'agency';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-6xl font-display font-black uppercase tracking-tighter leading-none">Dashboard</h1>
            <p className="text-xl font-mono mt-2 uppercase font-bold text-muted-foreground">Business Overview & Metrics.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <OnboardingTooltip tourId="add-contact-btn" content="Quickly add a new contact from here.">
              <Button className="brutalist-button bg-orange-500 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </OnboardingTooltip>
            <Button variant="outline" className="brutalist-button">
              <Import className="mr-2 h-4 w-4" /> Import CSV
            </Button>
            <DataExport />
          </div>
        </div>
        <div className="border-4 border-black bg-white overflow-hidden shadow-brutalist">
          <ResizablePanelGroup direction="vertical" className="min-h-[800px]">
            <ResizablePanel defaultSize={isAgency ? 50 : 100}>
              <div className="p-6 h-full overflow-auto">
                <ReportingDashboard />
              </div>
            </ResizablePanel>
            {isAgency && (
              <>
                <ResizableHandle className="h-2 bg-black" />
                <ResizablePanel defaultSize={50}>
                  <div className="p-6 h-full overflow-auto bg-orange-50">
                    <h2 className="text-4xl font-display font-black uppercase mb-8 tracking-tighter">Agency Overview</h2>
                    <AgencyReport />
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}