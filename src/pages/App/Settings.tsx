import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationSettings } from "@/components/IntegrationSettings";
import { TeamManagement } from "@/components/TeamManagement";
import { StripeBilling } from "@/components/StripeBilling";
import { BrandingSettings } from "@/components/BrandingSettings";
import { WebhookManager } from "@/components/WebhookManager";
import { APIKeyManager } from "@/components/APIKeyManager";
import { SupportTicketSystem } from "@/components/SupportTicketSystem";
import { useAuthStore } from "@/lib/mock-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { OnboardingTooltip } from "@/components/OnboardingTooltip";
function AccountSettings() {
  const user = useAuthStore(s => s.user);
  return (
    <div className="brutalist-card bg-white">
      <h3 className="text-2xl font-black uppercase mb-6 tracking-tighter">Account Profile</h3>
      <div className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <Label className="font-black uppercase text-xs">Full Name</Label>
          <Input className="brutalist-input" defaultValue={user?.name} />
        </div>
        <div className="space-y-2">
          <Label className="font-black uppercase text-xs">Email Address</Label>
          <Input className="brutalist-input" type="email" defaultValue={user?.email} />
        </div>
        <Button className="brutalist-button bg-black text-white">Update Profile</Button>
      </div>
    </div>
  );
}
export function Settings() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const isAgency = currentOrg?.type === 'agency';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="mb-12">
          <h1 className="editorial-heading">Settings</h1>
          <p className="text-xl font-mono mt-2 uppercase font-bold text-muted-foreground">Configuration & Governance.</p>
        </div>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-12">
            {['account', 'team', 'billing', 'integrations', 'webhooks', 'api', 'branding', 'help'].map((tab) => {
              if (tab === 'branding' && !isAgency) return null;
              return (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="brutalist-button bg-white data-[state=active]:bg-black data-[state=active]:text-white px-6 py-3 text-xs font-black uppercase tracking-widest"
                >
                  {tab}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <div className="mt-0">
            <TabsContent value="account"><AccountSettings /></TabsContent>
            <TabsContent value="team"><TeamManagement /></TabsContent>
            <TabsContent value="billing"><StripeBilling /></TabsContent>
            <TabsContent value="integrations"><IntegrationSettings /></TabsContent>
            <TabsContent value="webhooks"><WebhookManager /></TabsContent>
            <TabsContent value="api"><APIKeyManager /></TabsContent>
            {isAgency && <TabsContent value="branding"><BrandingSettings /></TabsContent>}
            <TabsContent value="help">
              <div className="space-y-8">
                <SupportTicketSystem />
                <div className="brutalist-card bg-orange-500 text-white flex justify-between items-center">
                  <span className="font-black uppercase text-lg">Need more help?</span>
                  <Button className="brutalist-button bg-black text-white" asChild>
                    <Link to="/app/help">KNOWLEDGE BASE &rarr;</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}