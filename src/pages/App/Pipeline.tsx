import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
const pipelineData = {
  'New Lead': [
    { id: 'deal-1', title: 'Website Redesign', value: 5000, contact: 'Creative Inc.' },
    { id: 'deal-2', title: 'Marketing Campaign', value: 12000, contact: 'Growth Co.' },
  ],
  'Contact Made': [
    { id: 'deal-3', title: 'SEO Audit', value: 2500, contact: 'Searchify' },
  ],
  'Proposal Sent': [
    { id: 'deal-4', title: 'App Development', value: 25000, contact: 'MobileFirst' },
  ],
};
type Deal = { id: string; title: string; value: number; contact: string };
type PipelineColumn = keyof typeof pipelineData;
const DealCard = ({ deal }: { deal: Deal }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="p-4 mb-4 bg-card rounded-lg border shadow-sm cursor-grab active:cursor-grabbing"
  >
    <div className="flex justify-between items-start">
      <h4 className="font-semibold">{deal.title}</h4>
      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
    </div>
    <p className="text-sm text-muted-foreground">{deal.contact}</p>
    <p className="text-sm font-bold mt-2">${deal.value.toLocaleString()}</p>
  </motion.div>
);
export function Pipeline() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Pipeline</h1>
            <p className="text-muted-foreground">Drag and drop deals to manage your sales process.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {(Object.keys(pipelineData) as PipelineColumn[]).map((stage) => (
            <div key={stage} className="bg-muted/50 p-4 rounded-lg h-full">
              <h3 className="font-semibold mb-4">{stage} ({pipelineData[stage].length})</h3>
              <div className="space-y-4">
                {pipelineData[stage].map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}