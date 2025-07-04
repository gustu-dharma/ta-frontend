// constants/data.ts
import { NavItem } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Medical Platform Navigation Items for IBrain2u
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Medical Viewer',
    url: '/dashboard/viewer',
    icon: 'brain',
    isActive: true,
    shortcut: ['m', 'v'],
    items: [
      {
        title: 'NIfTI Viewer',
        url: '/dashboard/viewer',
        icon: 'eye'
      },
      {
        title: 'DICOM Viewer',
        url: '/dashboard/viewer/dicom',
        icon: 'scan'
      },
      {
        title: 'Multi-Modal',
        url: '/dashboard/viewer/multimodal',
        icon: 'layers'
      }
    ]
  },
  {
    title: 'Analysis Tools',
    url: '/dashboard/analysis',
    icon: 'analytics',
    isActive: false,
    shortcut: ['a', 't'],
    items: [
      {
        title: 'Brain Segmentation',
        url: '/dashboard/analysis/segmentation',
        icon: 'brain'
      },
      {
        title: 'Volume Analysis',
        url: '/dashboard/analysis/volume',
        icon: 'calculator'
      },
      {
        title: 'Statistical Maps',
        url: '/dashboard/analysis/stats',
        icon: 'barChart'
      },
      {
        title: 'AI Diagnosis',
        url: '/dashboard/analysis/ai',
        icon: 'bot'
      }
    ]
  },
  {
    title: 'Patient Management',
    url: '/dashboard/patients',
    icon: 'users',
    isActive: false,
    shortcut: ['p', 'm'],
    items: [
      {
        title: 'Patient List',
        url: '/dashboard/patients',
        icon: 'userList'
      },
      {
        title: 'Add Patient',
        url: '/dashboard/patients/new',
        icon: 'userPlus'
      },
      {
        title: 'Medical History',
        url: '/dashboard/patients/history',
        icon: 'history'
      }
    ]
  },
  {
    title: 'File Management',
    url: '/dashboard/files',
    icon: 'folder',
    isActive: false,
    shortcut: ['f', 'm'],
    items: [
      {
        title: 'Upload Files',
        url: '/dashboard/files/upload',
        icon: 'upload'
      },
      {
        title: 'Recent Files',
        url: '/dashboard/files/recent',
        icon: 'clock'
      },
      {
        title: 'Archive',
        url: '/dashboard/files/archive',
        icon: 'archive'
      }
    ]
  },
  {
    title: 'Reports',
    url: '/dashboard/reports',
    icon: 'fileText',
    isActive: false,
    shortcut: ['r', 'p'],
    items: [
      {
        title: 'Medical Reports',
        url: '/dashboard/reports/medical',
        icon: 'medicalReport'
      },
      {
        title: 'Analytics Reports',
        url: '/dashboard/reports/analytics',
        icon: 'chartBar'
      },
      {
        title: 'Export Data',
        url: '/dashboard/reports/export',
        icon: 'download'
      }
    ]
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: 'settings',
    isActive: false,
    shortcut: ['s', 't'],
    items: [
      {
        title: 'General',
        url: '/dashboard/settings',
        icon: 'settings'
      },
      {
        title: 'Viewer Preferences',
        url: '/dashboard/settings/viewer',
        icon: 'eye'
      },
      {
        title: 'Account',
        url: '/dashboard/settings/account',
        icon: 'user'
      },
      {
        title: 'Security',
        url: '/dashboard/settings/security',
        icon: 'shield'
      }
    ]
  }
];

// Medical Users/Patients interface
export interface MedicalUser {
  id: number;
  name: string;
  email: string;
  patientId: string;
  lastScan: string;
  image: string;
  initials: string;
  diagnosis?: string;
}

// Recent scans/patients data for dashboard
export const recentScansData: MedicalUser[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    patientId: 'PAT-2024-001',
    lastScan: 'Brain MRI - 2 hours ago',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'SJ',
    diagnosis: 'Normal'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    email: 'michael.chen@clinic.com',
    patientId: 'PAT-2024-002',
    lastScan: 'CT Scan - 5 hours ago',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'MC',
    diagnosis: 'Under Review'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@medical.com',
    patientId: 'PAT-2024-003',
    lastScan: 'fMRI - 1 day ago',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'ER',
    diagnosis: 'Abnormal'
  },
  {
    id: 4,
    name: 'Dr. David Kim',
    email: 'david.kim@neurology.com',
    patientId: 'PAT-2024-004',
    lastScan: 'DTI Scan - 2 days ago',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'DK',
    diagnosis: 'Normal'
  },
  {
    id: 5,
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@radiology.com',
    patientId: 'PAT-2024-005',
    lastScan: 'PET Scan - 3 days ago',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'LT',
    diagnosis: 'Follow-up Required'
  }
];

// Keep original sales data for backward compatibility
export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];