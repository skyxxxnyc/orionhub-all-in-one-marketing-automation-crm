import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { enableMapSet } from "immer";
import '@/lib/errorReporter';
import '@/index.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { App } from '@/components/App';
enableMapSet();
const container = document.getElementById('root');
if (container) {
  let root = (container as any)._reactRoot;
  if (!root) {
    root = createRoot(container);
    (container as any)._reactRoot = root;
  }
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  console.error('React setup failed: Root container not found.');
}