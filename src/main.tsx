import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { Toaster } from '@/components/ui/sonner';
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
// Layouts & Auth
import { useAuthStore } from '@/lib/mock-auth';
import { AppRoutes } from '@/components/AppRoutes';
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
      { path: "funnels/:id", element: <PageEditor /> },
      { path: "pages/:id/edit", element: <PageEditor /> },
    ],
  },
]);
export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors closeButton />
    </QueryClientProvider>
  );
}
const container = document.getElementById('root');
if (container) {
  // Reuse the root across HMR (react-refresh) to avoid calling createRoot multiple times
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
}