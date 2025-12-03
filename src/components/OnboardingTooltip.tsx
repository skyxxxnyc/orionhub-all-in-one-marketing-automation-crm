import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
interface OnboardingTooltipProps {
  children: React.ReactNode;
  tourId: string;
  content: string;
  // In a real implementation, we'd use a context to manage tour state
  // For this mock, we'll just display the popover on hover
}
export function OnboardingTooltip({ children, tourId, content }: OnboardingTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm mb-2">{content}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Step 1/8</span>
            <div>
              <Button variant="ghost" size="sm">Skip</Button>
              <Button size="sm">Next</Button>
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}