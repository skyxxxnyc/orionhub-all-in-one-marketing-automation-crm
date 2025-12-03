import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useLocation } from "react-router-dom";
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
// Layouts & Auth
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/lib/mock-auth';
import { Skeleton } from '@/components/ui/skeleton';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, location]);
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : null;
}
const AppRoutes = () => (
  <ProtectedRoute>
    <AppLayout>
      <Outlet />
    </AppLayout>
  </ProtectedRoute>
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <RouteErrorBoundary />,
  },
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
      // Placeholder for automations
      { path: "automations", element: <div>Automations Page</div> },
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster richColors closeButton />
    </ErrorBoundary>
  </StrictMode>,
);