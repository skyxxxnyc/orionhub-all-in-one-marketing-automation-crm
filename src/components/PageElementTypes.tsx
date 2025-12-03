import React from 'react';
import { NodeProps } from 'reactflow';
import { PageElement } from '@shared/types';
import { GenericElement } from '@/lib/page-utils';
export const PageElementNode = ({ data }: NodeProps<PageElement>) => {
  return (
    <div>
      <GenericElement data={data} />
    </div>
  );
};