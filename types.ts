
export enum AppTab {
  Home = 'home',
  Marketing = 'marketing',
  Orders = 'orders',
  TechnicalSpec = 'tech-spec',
  // Protocols = 'protocols', // Удалено, выполняется вручную
  ProcurementPlan = 'procurement-plan',
  SuppliersDB = 'suppliers-db',
  EnsTru = 'enstru'
}

export type Language = 'ru' | 'kk' | 'en';

export interface Supplier {
  id: string;
  name: string;
  bin: string;
  category: string;
  rating: number;
  status: 'Active' | 'Blacklisted' | 'Pending';
  lastContractDate: string;
}

export interface ProcurementItem {
  id: string;
  title: string;
  status: 'Planning' | 'Ongoing' | 'Completed' | 'Cancelled';
  budget: number;
  deadline: string;
}

export interface EnsTruItem {
  code: string;
  nameRu: string;
  nameKk: string;
  unitRu: string;
  category: string;
  standards?: string[];
  mkei?: { code: string; name: string }[];
  tnved?: { code: string; name: string }[];
}
