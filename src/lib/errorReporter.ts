import React from 'react';
interface ClientErrorReport {
  message: string;
  url: string;
  userAgent: string;
  timestamp: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: boolean;
  errorBoundaryProps?: Record<string, unknown>;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: unknown;
}
let isInstalled = false;
let isStrictMode = false;
let lastReportedError: Error | null = null;
let lastReportedTimestamp = 0;
function sendReport(report: ClientErrorReport) {
  // Debounce identical errors reported in quick succession
  if (lastReportedError && lastReportedError.message === report.message && Date.now() - lastReportedTimestamp < 1000) {
    return;
  }
  lastReportedError = report.error as Error;
  lastReportedTimestamp = Date.now();
  fetch('/api/client-errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  }).catch(console.error);
}
function createImmediateErrorPayload(error: unknown, source: string): ClientErrorReport {
  const err = error instanceof Error ? error : new Error(String(error));
  return {
    message: err.message,
    stack: err.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    source,
    error,
  };
}
function setupGlobalErrorHandlers() {
  if (isInstalled) return;
  isInstalled = true;
  window.addEventListener('error', (event) => {
    sendReport({
      ...createImmediateErrorPayload(event.error, 'window.onerror'),
      lineno: event.lineno,
      colno: event.colno,
    });
  });
  window.addEventListener('unhandledrejection', (event) => {
    sendReport(createImmediateErrorPayload(event.reason, 'unhandledrejection'));
  });
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    originalConsoleError.apply(console, args);
    // Capture React's specific error messages
    if (typeof args[0] === 'string' && (args[0].includes('The above error occurred in the') || args[0].includes('Warning:'))) {
      sendReport(createImmediateErrorPayload(args[0], 'console.error'));
    }
  };
}
// Call this once, e.g., in main.tsx
setupGlobalErrorHandlers();
// Hook for announcing messages to screen readers
export function useAnnounce() {
  const announcer = React.useRef<HTMLDivElement | null>(null);
  if (!announcer.current) {
    const el = document.createElement('div');
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');
    el.style.position = 'absolute';
    el.style.width = '1px';
    el.style.height = '1px';
    el.style.margin = '-1px';
    el.style.padding = '0';
    el.style.overflow = 'hidden';
    el.style.clip = 'rect(0, 0, 0, 0)';
    el.style.whiteSpace = 'nowrap';
    el.style.border = '0';
    document.body.appendChild(el);
    announcer.current = el;
  }
  return React.useCallback((message: string) => {
    if (announcer.current) {
      announcer.current.textContent = message;
    }
  }, []);
}
// Lazy load heavy components
export function lazyLoad(factory: () => Promise<{ default: React.ComponentType<any> }>) {
  return React.lazy(factory);
}
export const errorReporter = {
  logError: (error: Error, errorInfo?: React.ErrorInfo) => {
    // In StrictMode, React may invoke this twice. We only want to report once.
    if (isStrictMode && error.message === lastReportedError?.message) {
      return;
    }
    sendReport({
      ...createImmediateErrorPayload(error, 'ErrorBoundary'),
      componentStack: errorInfo?.componentStack,
    });
  },
  // Detect if we're in React StrictMode
  setStrictMode: (isStrict: boolean) => {
    isStrictMode = isStrict;
  }
};