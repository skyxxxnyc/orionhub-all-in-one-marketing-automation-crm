import React from 'react';
import { Node } from 'reactflow';
import { PageElement } from '@shared/types';
import { cn } from '@/lib/utils';
import { PageElementNode } from './PageElementTypes';
interface PagePreviewProps {
  nodes: Node<PageElement>[];
  viewMode: 'desktop' | 'tablet' | 'mobile';
}
export function PagePreview({ nodes, viewMode }: PagePreviewProps) {
  const viewClasses = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto',
  };
  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-800 h-full overflow-auto">
      <div className={cn("bg-white dark:bg-black shadow-lg transition-all duration-300", viewClasses[viewMode])}>
        <div className="relative h-[800px]">
          {nodes.map(node => (
            <div key={node.id} style={{ position: 'absolute', left: node.position.x, top: node.position.y, width: node.width, height: node.height }}>
              {/* The Node type from reactflow can be complex, casting to any for preview is acceptable here */}
              <PageElementNode {...(node as any)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}