import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NodeData } from '@shared/types';
export const CustomNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  const Icon = (LucideIcons as any)[data.icon] || LucideIcons.HelpCircle;
  const typeColorMap = {
    trigger: 'bg-green-500/20 border-green-500/50 text-green-300',
    action: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    condition: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
    end: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "w-56 border-2 bg-slate-800/50 backdrop-blur-sm",
        selected ? "border-orange-500 shadow-lg shadow-orange-500/20" : "border-slate-700"
      )}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", typeColorMap[data.type as keyof typeof typeColorMap])}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-sm text-white">{data.label}</p>
              <Badge variant="outline" className={cn("text-xs capitalize", typeColorMap[data.type as keyof typeof typeColorMap])}>{data.type}</Badge>
            </div>
          </div>
          {data.config?.subject && <p className="text-xs text-muted-foreground mt-1 truncate">Subject: {data.config.subject}</p>}
        </CardContent>
      </Card>
      {data.type !== 'trigger' && <Handle type="target" position={Position.Left} className="!bg-slate-500" />}
      {data.type !== 'end' && (
        data.type === 'condition' ? (
          <>
            <Handle type="source" position={Position.Right} id="yes" style={{ top: '33%' }} className="!bg-green-500" />
            <Handle type="source" position={Position.Right} id="no" style={{ top: '66%' }} className="!bg-red-500" />
          </>
        ) : (
          <Handle type="source" position={Position.Right} className="!bg-slate-500" />
        )
      )}
    </motion.div>
  );
});