import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationSettings } from "@/components/IntegrationSettings";
import { TeamManagement } from "@/components/TeamManagement";
import { StripeBilling } from "@/components/StripeBilling";
import { BrandingSettings } from "@/components/BrandingSettings";
import { WebhookManager } from "@/components/WebhookManager";
import { APIKeyManager } from "@/components/APIKeyManager";
import { useAuthStore } from "@/lib/mock-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
function AccountSettings() {
  const user = useAuthStore(s => s.user);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" defaultValue={user?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue={user?.email} />
        </div>
        <Button>Update Profile</Button>
      </CardContent>
    </Card>
  );
}
export function Settings() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const isAgency = currentOrg?.type === 'agency';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account, team, and integrations.</p>
        </div>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            {isAgency && <TabsTrigger value="branding">Branding</TabsTrigger>}
          </TabsList>
          <TabsContent value="account" className="mt-6">
            <AccountSettings />
          </TabsContent>
          <TabsContent value="team" className="mt-6">
            <TeamManagement />
          </TabsContent>
          <TabsContent value="billing" className="mt-6">
            <StripeBilling />
          </TabsContent>
          <TabsContent value="integrations" className="mt-6">
            <IntegrationSettings />
          </TabsContent>
          <TabsContent value="webhooks" className="mt-6">
            <WebhookManager />
          </TabsContent>
          <TabsContent value="api" className="mt-6">
            <APIKeyManager />
          </TabsContent>
          {isAgency && (
            <TabsContent value="branding" className="mt-6">
              <BrandingSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}