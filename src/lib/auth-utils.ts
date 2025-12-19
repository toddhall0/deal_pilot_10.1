import { auth, hasRole, hasMinimumRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import type { UserRole } from '@prisma/client';

/**
 * Check if attorney can access a specific client
 */
export async function canAccessClient(
  userId: string,
  userRole: UserRole,
  clientId: string
): Promise<boolean> {
  // Admin can access all clients
  if (userRole === 'ADMIN') {
    return true;
  }

  // Attorneys can only access their assigned clients
  if (userRole === 'ATTORNEY') {
    const assignment = await prisma.clientUser.findUnique({
      where: {
        attorneyId_clientId: {
          attorneyId: userId,
          clientId,
        },
      },
    });
    return !!assignment;
  }

  // Client users can only access their own client
  if (userRole === 'CLIENT') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { clientId: true },
    });
    return user?.clientId === clientId;
  }

  return false;
}

/**
 * Check if user can access a specific deal
 */
export async function canAccessDeal(
  userId: string,
  userRole: UserRole,
  dealId: string
): Promise<boolean> {
  // Admin can access all deals
  if (userRole === 'ADMIN') {
    return true;
  }

  // Get the deal's client
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    select: { clientId: true },
  });

  if (!deal) {
    return false;
  }

  // Check if user can access the deal's client
  return canAccessClient(userId, userRole, deal.clientId);
}

/**
 * Get clients that user has access to
 */
export async function getAccessibleClientIds(
  userId: string,
  userRole: UserRole,
  firmId?: string | null
): Promise<string[]> {
  // Admin can access all clients in their firm
  if (userRole === 'ADMIN') {
    if (!firmId) return [];
    const clients = await prisma.client.findMany({
      where: { firmId },
      select: { id: true },
    });
    return clients.map((c) => c.id);
  }

  // Attorneys can access their assigned clients
  if (userRole === 'ATTORNEY') {
    const assignments = await prisma.clientUser.findMany({
      where: { attorneyId: userId },
      select: { clientId: true },
    });
    return assignments.map((a) => a.clientId);
  }

  // Client users can only access their own client
  if (userRole === 'CLIENT') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { clientId: true },
    });
    return user?.clientId ? [user.clientId] : [];
  }

  return [];
}

/**
 * Server component helper to require authentication
 * Redirects to login if not authenticated
 */
export async function requireAuthPage(requiredRoles?: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (requiredRoles && !hasRole(session.user.role, requiredRoles)) {
    redirect('/unauthorized');
  }

  return session.user;
}

/**
 * Check if user can perform action on resource
 */
export interface PermissionCheck {
  userId: string;
  userRole: UserRole;
  resource: 'deal' | 'task' | 'document' | 'note' | 'client' | 'user' | 'firm';
  action: 'create' | 'read' | 'update' | 'delete';
  resourceId?: string;
}

export async function checkPermission(check: PermissionCheck): Promise<boolean> {
  const { userRole, resource, action, resourceId, userId } = check;

  // Admin has full access
  if (userRole === 'ADMIN') {
    return true;
  }

  // Role-based permission matrix
  const permissions: Record<UserRole, Record<string, string[]>> = {
    ADMIN: {
      deal: ['create', 'read', 'update', 'delete'],
      task: ['create', 'read', 'update', 'delete'],
      document: ['create', 'read', 'update', 'delete'],
      note: ['create', 'read', 'update', 'delete'],
      client: ['create', 'read', 'update', 'delete'],
      user: ['create', 'read', 'update', 'delete'],
      firm: ['create', 'read', 'update', 'delete'],
    },
    ATTORNEY: {
      deal: ['create', 'read', 'update', 'delete'],
      task: ['create', 'read', 'update', 'delete'],
      document: ['create', 'read', 'update', 'delete'],
      note: ['create', 'read', 'update', 'delete'],
      client: ['read', 'update'],
      user: ['read'],
      firm: ['read'],
    },
    CLIENT: {
      deal: ['read'],
      task: ['read', 'update'], // Can update task status
      document: ['read'],
      note: ['create', 'read', 'update', 'delete'],
      client: ['read'],
      user: ['read'],
      firm: [],
    },
  };

  // Check if role has permission for the action
  const rolePermissions = permissions[userRole]?.[resource] || [];
  if (!rolePermissions.includes(action)) {
    return false;
  }

  // For read/update/delete, also check resource-level access
  if (resourceId && (action === 'read' || action === 'update' || action === 'delete')) {
    switch (resource) {
      case 'deal':
        return canAccessDeal(userId, userRole, resourceId);
      case 'client':
        return canAccessClient(userId, userRole, resourceId);
      case 'task':
      case 'document':
      case 'note':
        // These are all tied to deals, get the deal first
        const dealRelation = await getDealIdForResource(resource, resourceId);
        if (!dealRelation) return false;
        return canAccessDeal(userId, userRole, dealRelation);
      default:
        return true;
    }
  }

  return true;
}

async function getDealIdForResource(
  resource: 'task' | 'document' | 'note',
  resourceId: string
): Promise<string | null> {
  switch (resource) {
    case 'task':
      const task = await prisma.task.findUnique({
        where: { id: resourceId },
        select: { dealId: true },
      });
      return task?.dealId ?? null;
    case 'document':
      const doc = await prisma.document.findUnique({
        where: { id: resourceId },
        select: { dealId: true },
      });
      return doc?.dealId ?? null;
    case 'note':
      const note = await prisma.note.findUnique({
        where: { id: resourceId },
        select: { dealId: true },
      });
      return note?.dealId ?? null;
    default:
      return null;
  }
}

/**
 * Role display helpers
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    ADMIN: 'Administrator',
    ATTORNEY: 'Attorney',
    CLIENT: 'Client',
  };
  return labels[role] || role;
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    ADMIN: 'destructive',
    ATTORNEY: 'default',
    CLIENT: 'secondary',
  };
  return colors[role] || 'default';
}

export { hasRole, hasMinimumRole };
