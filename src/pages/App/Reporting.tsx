import { AdvancedReporting } from "@/components/AdvancedReporting";
import { DataExport } from "@/components/DataExport";
import { useAuthStore } from "@/lib/mock-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_WORKSPACES } from "@shared/mock-data";
import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
export function Reporting() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const isAgency = currentOrg?.type === 'agency';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="editorial-heading">Reporting</h1>
            <p className="text-xl font-mono mt-2 uppercase font-bold text-muted-foreground">Intelligence & Analytics.</p>
          </div>
          <div className="flex gap-3">
            <DataExport />
          </div>
        </div>
        {isAgency && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="brutalist-card bg-white p-0 overflow-hidden">
              <div className="bg-black text-white p-4 flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tighter">Sub-account Performance</h3>
                <PieChart className="h-5 w-5 text-orange-500" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-2 border-black">
                    <TableHead className="font-black uppercase text-xs">Sub-account</TableHead>
                    <TableHead className="font-black uppercase text-xs">Contacts</TableHead>
                    <TableHead className="font-black uppercase text-xs">Pipeline Value</TableHead>
                    <TableHead className="font-black uppercase text-xs text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_WORKSPACES.filter(ws => ws.orgId === currentOrg?.id && ws.id !== 'ws-1').map(ws => (
                    <TableRow key={ws.id} className="border-b-2 border-black hover:bg-orange-50">
                      <TableCell className="font-black uppercase text-sm">{ws.name}</TableCell>
                      <TableCell className="font-mono text-xs">{(Math.random() * 1000).toFixed(0)}</TableCell>
                      <TableCell className="font-mono text-xs">${(Math.random() * 50000).toFixed(2)}</TableCell>
                      <TableCell className="text-right text-green-600 font-black text-xs">+{(Math.random() * 15).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="brutalist-card bg-orange-500 text-white">
            <span className="font-black uppercase text-xs tracking-widest">Conversion Rate</span>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-5xl font-black">24.5%</span>
              <TrendingUp className="h-8 w-8 text-black" />
            </div>
          </div>
          <div className="brutalist-card bg-black text-white">
            <span className="font-black uppercase text-xs tracking-widest">Active Campaigns</span>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-5xl font-black">12</span>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="brutalist-card bg-white border-4 border-black">
            <span className="font-black uppercase text-xs tracking-widest">Avg. Deal Size</span>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-5xl font-black text-black">$4.2K</span>
              <div className="h-8 w-8 bg-orange-500 rounded-full" />
            </div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <AdvancedReporting />
        </motion.div>
      </div>
    </div>
  );
}