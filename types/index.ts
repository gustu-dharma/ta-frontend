// types/index.ts
import { z } from 'zod';

// User Roles
export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  LAB_STAFF = 'lab_staff',
  PATIENT = 'patient'
}

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.nativeEnum(UserRole),
  avatar: z.string().optional(),
  licenseNumber: z.string().optional(), // For doctors
  departmentId: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Patient Schema
export const PatientSchema = z.object({
  id: z.string(),
  userId: z.string(), // Reference to User
  patientCode: z.string().regex(/^P\d{6}$/, "Patient code must be P followed by 6 digits"),
  dateOfBirth: z.date(),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional(),
  medicalHistory: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Patient = z.infer<typeof PatientSchema>;

// MRI Scan Schema
export const MRIScanSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  scanCode: z.string().regex(/^MRI\d{8}$/, "Scan code must be MRI followed by 8 digits"),
  title: z.string().min(1),
  description: z.string().optional(),
  scanDate: z.date(),
  scanType: z.enum(['T1', 'T2', 'FLAIR', 'DWI', 'DTI', 'fMRI', 'OTHER']),
  bodyPart: z.enum(['brain', 'spine', 'abdomen', 'pelvis', 'chest', 'extremities']),
  files: z.array(z.object({
    id: z.string(),
    filename: z.string(),
    originalName: z.string(),
    fileUrl: z.string(),
    fileSize: z.number(),
    fileType: z.enum(['nifti', 'dicom']),
    isOverlay: z.boolean().default(false),
    uploadedBy: z.string(), // User ID
    uploadedAt: z.date(),
  })),
  status: z.enum(['pending', 'processing', 'completed', 'error']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  uploadedBy: z.string(), // Lab staff user ID
  reviewedBy: z.string().optional(), // Doctor user ID
  reviewedAt: z.date().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false), // For research/teaching
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MRIScan = z.infer<typeof MRIScanSchema>;

// Comment Schema
export const CommentSchema = z.object({
  id: z.string(),
  scanId: z.string(),
  authorId: z.string(),
  content: z.string().min(1),
  type: z.enum(['note', 'finding', 'recommendation', 'question']),
  isPrivate: z.boolean().default(false), // Only visible to medical staff
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    slice: z.number(),
    view: z.enum(['axial', 'coronal', 'sagittal', '3d']),
  }).optional(),
  parentId: z.string().optional(), // For replies
  attachments: z.array(z.object({
    id: z.string(),
    filename: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
  })).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Comment = z.infer<typeof CommentSchema>;

// Department Schema
export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  headOfDepartment: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Department = z.infer<typeof DepartmentSchema>;

// Form Schemas for validation
export const CreateUserFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.nativeEnum(UserRole),
  licenseNumber: z.string().optional(),
  departmentId: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const UpdateUserFormSchema = CreateUserFormSchema.partial().omit({ password: true });

export const CreatePatientFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    phone: z.string().min(1, "Emergency contact phone is required"),
    relationship: z.string().min(1, "Relationship is required"),
  }).optional(),
  medicalHistory: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
});

export const UploadMRIFormSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  scanType: z.enum(['T1', 'T2', 'FLAIR', 'DWI', 'DTI', 'fMRI', 'OTHER']),
  bodyPart: z.enum(['brain', 'spine', 'abdomen', 'pelvis', 'chest', 'extremities']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  tags: z.array(z.string()).default([]),
  files: z.array(z.instanceof(File)).min(1, "At least one file is required"),
  overlayFiles: z.array(z.instanceof(File)).default([]),
});

export const AddCommentFormSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  type: z.enum(['note', 'finding', 'recommendation', 'question']),
  isPrivate: z.boolean().default(false),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    slice: z.number(),
    view: z.enum(['axial', 'coronal', 'sagittal', '3d']),
  }).optional(),
  parentId: z.string().optional(),
});

export const UpdateScanFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'error']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  tags: z.array(z.string()).default([]),
});

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalScans: number;
  totalPatients: number;
  pendingReviews: number;
  completedScans: number;
  monthlyGrowth: {
    scans: number;
    patients: number;
  };
  scansByType: Record<string, number>;
  scansByStatus: Record<string, number>;
  recentActivity: Array<{
    id: string;
    type: 'scan_uploaded' | 'scan_reviewed' | 'comment_added' | 'patient_registered';
    description: string;
    timestamp: Date;
    userId: string;
    userName: string;
  }>;
}

// Permission Types
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  condition?: string;
}

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { resource: '*', action: 'create' },
    { resource: '*', action: 'read' },
    { resource: '*', action: 'update' },
    { resource: '*', action: 'delete' },
  ],
  [UserRole.DOCTOR]: [
    { resource: 'scans', action: 'read' },
    { resource: 'scans', action: 'update', condition: 'own_patients' },
    { resource: 'patients', action: 'read' },
    { resource: 'comments', action: 'create' },
    { resource: 'comments', action: 'read' },
    { resource: 'comments', action: 'update', condition: 'own' },
  ],
  [UserRole.LAB_STAFF]: [
    { resource: 'scans', action: 'create' },
    { resource: 'scans', action: 'read' },
    { resource: 'scans', action: 'update', condition: 'own' },
    { resource: 'patients', action: 'read' },
    { resource: 'patients', action: 'create' },
  ],
  [UserRole.PATIENT]: [
    { resource: 'scans', action: 'read', condition: 'own' },
    { resource: 'comments', action: 'read', condition: 'own_scans' },
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'update', condition: 'own' },
  ],
};

// Export form types
export type CreateUserForm = z.infer<typeof CreateUserFormSchema>;
export type UpdateUserForm = z.infer<typeof UpdateUserFormSchema>;
export type CreatePatientForm = z.infer<typeof CreatePatientFormSchema>;
export type UploadMRIForm = z.infer<typeof UploadMRIFormSchema>;
export type AddCommentForm = z.infer<typeof AddCommentFormSchema>;
export type UpdateScanForm = z.infer<typeof UpdateScanFormSchema>;