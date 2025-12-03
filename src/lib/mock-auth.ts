import { create } from 'zustand';
import { User, Organization, Workspace } from '@shared/types';
import { MOCK_ORGANIZATIONS, MOCK_WORKSPACES } from '@shared/mock-data';
const MOCK_USER_KEY = 'orionhub_mock_user';
const MOCK_TOKEN_KEY = 'orionhub_mock_token';
const MOCK_ORG_KEY = 'orionhub_mock_org';
const MOCK_WS_KEY = 'orionhub_mock_ws';
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentOrg: Organization | null;
  currentWorkspace: Workspace | null;
  organizations: Organization[];
  workspaces: Workspace[];
  login: (email: string) => Promise<User>;
  register: (name: string, email: string) => Promise<User>;
  logout: () => void;
  checkAuth: () => void;
  switchOrganization: (orgId: string) => void;
  switchWorkspace: (workspaceId: string) => void;
}
const getInitialStateFromLocalStorage = () => {
  try {
    const token = localStorage.getItem(MOCK_TOKEN_KEY);
    const userJson = localStorage.getItem(MOCK_USER_KEY);
    const orgJson = localStorage.getItem(MOCK_ORG_KEY);
    const wsJson = localStorage.getItem(MOCK_WS_KEY);
    const user = userJson ? JSON.parse(userJson) : null;
    const currentOrg = orgJson ? JSON.parse(orgJson) : null;
    const currentWorkspace = wsJson ? JSON.parse(wsJson) : null;
    return { token, user, currentOrg, currentWorkspace, isAuthenticated: !!token && !!user };
  } catch (error) {
    console.error("Failed to parse auth state from localStorage", error);
    return { token: null, user: null, currentOrg: null, currentWorkspace: null, isAuthenticated: false };
  }
};
export const useAuthStore = create<AuthState>((set, get) => ({
  ...getInitialStateFromLocalStorage(),
  isLoading: true,
  organizations: [],
  workspaces: [],
  login: async (email: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = { id: 'u1', name: 'Demo User', email };
        const token = `mock-token-${Date.now()}`;
        const userOrgs = MOCK_ORGANIZATIONS.filter(o => o.ownerId === user.id);
        const currentOrg = userOrgs[0] || null;
        const userWorkspaces = MOCK_WORKSPACES.filter(ws => ws.orgId === currentOrg?.id);
        const currentWorkspace = userWorkspaces[0] || null;
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
        localStorage.setItem(MOCK_TOKEN_KEY, token);
        if (currentOrg) localStorage.setItem(MOCK_ORG_KEY, JSON.stringify(currentOrg));
        if (currentWorkspace) localStorage.setItem(MOCK_WS_KEY, JSON.stringify(currentWorkspace));
        set({
          user, token, isAuthenticated: true,
          organizations: userOrgs,
          workspaces: userWorkspaces,
          currentOrg,
          currentWorkspace,
        });
        resolve(user);
      }, 500);
    });
  },
  register: async (name: string, email: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = { id: crypto.randomUUID(), name, email };
        const token = `mock-token-${Date.now()}`;
        const newOrg: Organization = { id: `org-${crypto.randomUUID()}`, name: `${name}'s Org`, type: 'client', branding: {}, workspaces: [`ws-${crypto.randomUUID()}`], ownerId: user.id, createdAt: Date.now() };
        const newWs: Workspace = { id: newOrg.workspaces[0], orgId: newOrg.id, name: 'Main Workspace', users: [user.id], permissions: { [user.id]: 'admin' } };
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
        localStorage.setItem(MOCK_TOKEN_KEY, token);
        localStorage.setItem(MOCK_ORG_KEY, JSON.stringify(newOrg));
        localStorage.setItem(MOCK_WS_KEY, JSON.stringify(newWs));
        set({
          user, token, isAuthenticated: true,
          organizations: [newOrg],
          workspaces: [newWs],
          currentOrg: newOrg,
          currentWorkspace: newWs,
        });
        resolve(user);
      }, 500);
    });
  },
  logout: () => {
    localStorage.removeItem(MOCK_USER_KEY);
    localStorage.removeItem(MOCK_TOKEN_KEY);
    localStorage.removeItem(MOCK_ORG_KEY);
    localStorage.removeItem(MOCK_WS_KEY);
    set({ user: null, token: null, isAuthenticated: false, currentOrg: null, currentWorkspace: null, organizations: [], workspaces: [], isLoading: false });
  },
  checkAuth: () => {
    const { token, user, currentOrg, currentWorkspace } = getInitialStateFromLocalStorage();
    const userOrgs = user ? MOCK_ORGANIZATIONS.filter(o => o.ownerId === user.id || o.workspaces.some(wsId => MOCK_WORKSPACES.find(ws => ws.id === wsId)?.users.includes(user.id))) : [];
    const userWorkspaces = currentOrg ? MOCK_WORKSPACES.filter(ws => ws.orgId === currentOrg.id) : [];
    set({
      token, user, isAuthenticated: !!token && !!user, isLoading: false,
      currentOrg, currentWorkspace,
      organizations: userOrgs,
      workspaces: userWorkspaces,
    });
  },
  switchOrganization: (orgId: string) => {
    const { organizations } = get();
    const newOrg = organizations.find(o => o.id === orgId);
    if (newOrg) {
      const newWorkspaces = MOCK_WORKSPACES.filter(ws => ws.orgId === newOrg.id);
      const newCurrentWorkspace = newWorkspaces[0] || null;
      localStorage.setItem(MOCK_ORG_KEY, JSON.stringify(newOrg));
      if (newCurrentWorkspace) {
        localStorage.setItem(MOCK_WS_KEY, JSON.stringify(newCurrentWorkspace));
      } else {
        localStorage.removeItem(MOCK_WS_KEY);
      }
      set({ currentOrg: newOrg, workspaces: newWorkspaces, currentWorkspace: newCurrentWorkspace });
    }
  },
  switchWorkspace: (workspaceId: string) => {
    const { workspaces } = get();
    const newWorkspace = workspaces.find(ws => ws.id === workspaceId);
    if (newWorkspace) {
      localStorage.setItem(MOCK_WS_KEY, JSON.stringify(newWorkspace));
      set({ currentWorkspace: newWorkspace });
    }
  },
}));