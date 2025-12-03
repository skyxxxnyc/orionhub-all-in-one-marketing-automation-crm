import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationSettings } from "@/components/IntegrationSettings";
import { TeamManagement } from "@/components/TeamManagement";
import { BillingPanel } from "@/components/BillingPanel";
import { BrandingSettings } from "@/components/BrandingSettings";
import { useAuthStore } from "@/lib/mock-auth";
export function Settings() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account, team, and billing.</p>
        </div>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            {currentOrg?.type === 'agency' && <TabsTrigger value="branding">Branding</TabsTrigger>}
          </TabsList>
          <TabsContent value="account" className="mt-6">
            {/* Account settings form will go here */}
            <p>Account Settings</p>
          </TabsContent>
          <TabsContent value="team" className="mt-6">
            <TeamManagement />
          </TabsContent>
          <TabsContent value="billing" className="mt-6">
            <BillingPanel />
          </TabsContent>
          <TabsContent value="integrations" className="mt-6">
            <IntegrationSettings />
          </TabsContent>
          {currentOrg?.type === 'agency' && (
            <TabsContent value="branding" className="mt-6">
              <BrandingSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}