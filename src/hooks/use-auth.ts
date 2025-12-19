'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { UserRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: string;
  avatar?: string | null;
  firmId?: string | null;
  clientId?: string | null;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user as AuthUser | undefined;

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!user;

  const isAdmin = user?.role === 'ADMIN';
  const isAttorney = user?.role === 'ATTORNEY';
  const isClient = user?.role === 'CLIENT';

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    if (!user) return false;
    const roleHierarchy: Record<UserRole, number> = {
      CLIENT: 1,
      ATTORNEY: 2,
      ADMIN: 3,
    };
    return roleHierarchy[user.role] >= roleHierarchy[minimumRole];
  };

  const canAccess = (resource: string, action: string): boolean => {
    if (!user) return false;

    // Admin can do everything
    if (isAdmin) return true;

    // Permission matrix for attorneys
    if (isAttorney) {
      const attorneyPermissions: Record<string, string[]> = {
        deal: ['create', 'read', 'update', 'delete'],
        task: ['create', 'read', 'update', 'delete'],
        document: ['create', 'read', 'update', 'delete'],
        note: ['create', 'read', 'update', 'delete'],
        client: ['read', 'update'],
        user: ['read'],
      };
      return attorneyPermissions[resource]?.includes(action) ?? false;
    }

    // Permission matrix for clients
    if (isClient) {
      const clientPermissions: Record<string, string[]> = {
        deal: ['read'],
        task: ['read', 'update'],
        document: ['read'],
        note: ['create', 'read', 'update', 'delete'],
        client: ['read'],
      };
      return clientPermissions[resource]?.includes(action) ?? false;
    }

    return false;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isAttorney,
    isClient,
    hasRole,
    hasMinimumRole,
    canAccess,
    session,
    status,
  };
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 * Redirects to unauthorized if wrong role
 */
export function useRequireAuth(options?: { roles?: UserRole[]; redirectTo?: string }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, hasRole: checkRole } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(options?.redirectTo ?? '/login');
      return;
    }

    if (options?.roles && !checkRole(options.roles)) {
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthenticated, user, router, options, checkRole]);

  return {
    user,
    isLoading,
    isAuthorized: isAuthenticated && (!options?.roles || checkRole(options.roles)),
  };
}

/**
 * Hook to check if current user can access a specific client
 */
export function useCanAccessClient(clientId: string | undefined) {
  const { user, isAdmin, isAttorney, isClient } = useAuth();

  if (!clientId || !user) return false;
  if (isAdmin) return true;

  // For attorneys, we'd need to check the database
  // This is a simplified client-side check
  // Real check should be done server-side
  if (isAttorney) return true; // Actual check done server-side

  if (isClient) {
    return user.clientId === clientId;
  }

  return false;
}
