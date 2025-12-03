import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { errorReporter } from '@/lib/errorReporter';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    errorReporter.logError(error, errorInfo);
  }
  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full text-center shadow-lg animate-scale-in">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 rounded-full p-3 w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="mt-4 text-2xl font-display">Oops! Something went wrong.</CardTitle>
              <CardDescription>
                We've been notified of the issue and are working to fix it. Please try again later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left bg-muted p-2 rounded-md text-xs">
                  <summary>Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    <code>{this.state.error.toString()}</code>
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}