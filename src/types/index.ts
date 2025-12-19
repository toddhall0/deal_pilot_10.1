import type {
  User,
  Organization,
  Client,
  Deal,
  Task,
  Document,
  Note,
  Milestone,
  Notification,
  DealStatus,
  TaskStatus,
  Priority,
  PropertyType,
  TransactionType,
  DocumentCategory,
  UserRole,
  OrganizationRole,
} from '@prisma/client';

// Re-export Prisma types
export type {
  User,
  Organization,
  Client,
  Deal,
  Task,
  Document,
  Note,
  Milestone,
  Notification,
  DealStatus,
  TaskStatus,
  Priority,
  PropertyType,
  TransactionType,
  DocumentCategory,
  UserRole,
  OrganizationRole,
};

// Extended types with relations
export interface DealWithRelations extends Deal {
  client?: Client | null;
  createdBy: User;
  tasks?: Task[];
  documents?: Document[];
  notes?: Note[];
  milestones?: Milestone[];
}

export interface TaskWithRelations extends Task {
  deal: Deal;
  assignee?: User | null;
  createdBy: User;
  subtasks?: Task[];
  parent?: Task | null;
  milestone?: Milestone | null;
}

export interface DocumentWithRelations extends Document {
  deal: Deal;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
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
  clientId?: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  status?: DealStatus;
  priority?: Priority;
  propertyAddress?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
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
