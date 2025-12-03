import React, { useState } from 'react';
import { useAuthStore } from '@/lib/mock-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export function BrandingSettings() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const [logo, setLogo] = useState(currentOrg?.branding.logo || '');
  const [primaryColor, setPrimaryColor] = useState(currentOrg?.branding.colors?.primary || '#F38020');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
        <CardDescription>Customize the look and feel for your clients.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL</Label>
          <Input id="logo" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://your-logo.com/logo.png" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex items-center gap-2">
            <Input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-10 p-1" />
            <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Preview</h4>
          <div className="flex items-center gap-4">
            {logo && <img src={logo} alt="Logo Preview" className="h-10" />}
            <Button style={{ backgroundColor: primaryColor }}>Example Button</Button>
          </div>
        </div>
        <Button>Save Branding</Button>
      </CardContent>
    </Card>
  );
}