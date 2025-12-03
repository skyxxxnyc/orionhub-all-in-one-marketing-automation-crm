import { AdvancedReporting } from "@/components/AdvancedReporting";
import { DataExport } from "@/components/DataExport";
import { useAuthStore } from "@/lib/mock-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_WORKSPACES } from "@shared/mock-data";
import { motion } from "framer-motion";
export function Reporting() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const isAgency = currentOrg?.type === 'agency';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reporting</h1>
            <p className="text-muted-foreground">Deep dive into your business analytics.</p>
          </div>
          <div className="flex gap-2">
            <DataExport />
          </div>
        </div>
        {isAgency && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Sub-account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sub-account</TableHead>
                      <TableHead>Contacts</TableHead>
                      <TableHead>Pipeline Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_WORKSPACES.filter(ws => ws.orgId === currentOrg?.id && ws.id !== 'ws-1').map(ws => (
                       <TableRow key={ws.id}>
                          <TableCell>{ws.name}</TableCell>
                          <TableCell>{(Math.random() * 1000).toFixed(0)}</TableCell>
                          <TableCell>${(Math.random() * 50000).toFixed(2)}</TableCell>
                       </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
        <motion.div 
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
        >
          <AdvancedReporting />
        </motion.div>
      </div>
    </div>
  );
}