import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/lib/mock-auth';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { AppRoutes } from '@/components/AppRoutes';
// Pages
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';
import { Dashboard } from '@/pages/App/Dashboard';
import { Contacts } from '@/pages/App/Contacts';
import { ContactDetail } from '@/pages/App/ContactDetail';
import { Pipeline } from '@/pages/App/Pipeline';
import { Automations } from '@/pages/App/Automations';
import { Campaigns } from '@/pages/App/Campaigns';
import { Inbox } from '@/pages/App/Inbox';
import { Funnels } from '@/pages/App/Funnels';
import { PageEditor } from '@/pages/App/PageEditor';
import { Calendar as CalendarPage } from '@/pages/App/Calendar';
import { Settings } from '@/pages/App/Settings';
import { Reporting } from '@/pages/App/Reporting';
import { HelpCenter } from '@/pages/App/HelpCenter';
import { ProjectManagement } from '@/pages/App/ProjectManagement';
import { Skeleton } from './ui/skeleton';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  { path: "/", element: <HomePage />, errorElement: <RouteErrorBoundary /> },
  { path: "/login", element: <LoginPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/register", element: <RegisterPage />, errorElement: <RouteErrorBoundary /> },
  {
    path: "/app",
    element: <AppRoutes />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "contacts", element: <Contacts /> },
      { path: "contacts/:id", element: <ContactDetail /> },
      { path: "pipeline", element: <Pipeline /> },
      { path: "automations", element: <Automations /> },
      { path: "campaigns", element: <Campaigns /> },
      { path: "inbox", element: <Inbox /> },
      { path: "funnels", element: <Funnels /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "settings", element: <Settings /> },
      { path: "reporting", element: <Reporting /> },
      { path: "help", element: <HelpCenter /> },
      { path: "projects", element: <ProjectManagement /> },
      { path: "funnels/:id", element: <PageEditor /> },
      { path: "pages/:id/edit", element: <PageEditor /> },
    ],
  },
]);
export function App() {
  function AuthLoader({ children }: { children: React.ReactNode }) {
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);
    
    if (isLoading) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 animate-pulse" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      );
    }
    
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthLoader>
        <RouterProvider router={router} />
      </AuthLoader>
      <Toaster richColors closeButton />
    </QueryClientProvider>
  );
}