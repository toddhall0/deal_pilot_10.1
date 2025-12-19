import type {
  User,
  Firm,
  Client,
  ClientUser,
  Deal,
  Task,
  Document,
  Note,
  Comment,
  Milestone,
  Notification,
  ActivityLog,
  Session,
  DealStatus,
  TaskStatus,
  Priority,
  PropertyType,
  TransactionType,
  DocumentCategory,
  UserRole,
  UserStatus,
  NotificationType,
} from '@prisma/client';

// Re-export Prisma types
export type {
  User,
  Firm,
  Client,
  ClientUser,
  Deal,
  Task,
  Document,
  Note,
  Comment,
  Milestone,
  Notification,
  ActivityLog,
  Session,
  DealStatus,
  TaskStatus,
  Priority,
  PropertyType,
  TransactionType,
  DocumentCategory,
  UserRole,
  UserStatus,
  NotificationType,
};

// User without sensitive data
export type SafeUser = Omit<User, 'passwordHash'>;

// Extended types with relations
export interface UserWithRelations extends SafeUser {
  firm?: Firm | null;
  client?: Client | null;
  managedClients?: ClientUser[];
}

export interface FirmWithRelations extends Firm {
  users?: User[];
  clients?: Client[];
}

export interface ClientWithRelations extends Client {
  firm: Firm;
  users?: User[];
  managingAttorneys?: (ClientUser & { attorney: SafeUser })[];
  deals?: Deal[];
}

export interface DealWithRelations extends Deal {
  client: Client;
  createdBy: SafeUser;
  tasks?: Task[];
  documents?: Document[];
  notes?: Note[];
  milestones?: Milestone[];
}

export interface TaskWithRelations extends Task {
  deal: Deal;
  assignee?: SafeUser | null;
  createdBy: SafeUser;
  subtasks?: Task[];
  parent?: Task | null;
  milestone?: Milestone | null;
  comments?: Comment[];
}

export interface DocumentWithRelations extends Document {
  deal: Deal;
}

export interface NoteWithRelations extends Note {
  deal: Deal;
  user: SafeUser;
}

export interface CommentWithRelations extends Comment {
  task: Task;
  user: SafeUser;
}

export interface SessionWithUser extends Session {
  user: SafeUser;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form types
export interface DealFormData {
  name: string;
  description?: string;
  clientId: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  status?: DealStatus;
  priority?: Priority;
  propertyAddress?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
  propertyCounty?: string;
  purchasePrice?: number;
  earnestMoney?: number;
  contractDate?: Date;
  dueDiligenceEnd?: Date;
  closingDate?: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  assigneeId?: string;
  milestoneId?: string;
  parentId?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status?: UserStatus;
  phone?: string;
  title?: string;
  firmId?: string;
  clientId?: string;
}

export interface ClientFormData {
  name: string;
  type?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
}

export interface FirmFormData {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
}

// Filter types
export interface DealFilters {
  status?: DealStatus[];
  priority?: Priority[];
  propertyType?: PropertyType[];
  transactionType?: TransactionType[];
  clientId?: string;
  search?: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: Priority[];
  assigneeId?: string;
  milestoneId?: string;
  dealId?: string;
  search?: string;
}

export interface UserFilters {
  role?: UserRole[];
  status?: UserStatus[];
  firmId?: string;
  clientId?: string;
  search?: string;
}

// Dashboard types
export interface DashboardStats {
  totalDeals: number;
  activeDeals: number;
  totalTasks: number;
  overdueTasks: number;
  upcomingDeadlines: number;
  recentActivity: number;
}

export interface DealStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingDeadlines: number;
  documentsCount: number;
  notesCount: number;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string | null;
  firmId?: string | null;
  clientId?: string | null;
}

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  firmId?: string | null;
  clientId?: string | null;
  iat?: number;
  exp?: number;
}

// Permission types
export type ResourceType = 'deal' | 'task' | 'document' | 'note' | 'client' | 'user' | 'firm';
export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'manage';

export interface Permission {
  resource: ResourceType;
  action: ActionType;
}
