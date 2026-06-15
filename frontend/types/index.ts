export enum UserRole { ADMIN = 'admin', USER = 'user' }
export enum Gender { MEN = 'men', WOMEN = 'women' }
export enum WearCategory { TOP_WEAR = 'top_wear', BOTTOM_WEAR = 'bottom_wear' }

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StyleImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Style {
  id: string;
  name: string;
  gender: Gender;
  wearCategory: WearCategory;
  brickName: string;
  fabricUsed: string;
  gsm?: number;
  fabricContent?: string;
  description?: string;
  category?: string;
  styleCode?: string;
  isActive: boolean;
  viewCount: number;
  images: StyleImage[];
  createdAt: string;
  updatedAt: string;
}

export interface FabricImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
}

export interface FabricColorway {
  id: string;
  colorName: string;
  colorCode?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface Fabric {
  id: string;
  name: string;
  brickName: string;
  fabricUsed: string;
  gsm?: number;
  fabricContent?: string;
  supplierName?: string;
  width?: number;
  widthUnit?: string;
  moq?: number;
  moqUnit?: string;
  notes?: string;
  articleNumber?: string;
  pricePerMeter?: number;
  currency?: string;
  isActive: boolean;
  images: FabricImage[];
  colorways: FabricColorway[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalStyles: number;
  totalFabrics: number;
  totalUsers: number;
  activeStyles: number;
  activeFabrics: number;
  recentStyles: Style[];
  recentFabrics: Fabric[];
  mostUsedFabrics: { fabricUsed: string; count: number }[];
  brickNameDistribution: { brickName: string; count: number }[];
  uploadTrends: { week: string; styles: number; fabrics: number }[];
}

export interface FilterOptions {
  genders: string[];
  wearCategories: string[];
  brickNames: string[];
  fabricTypes: string[];
  fabricContents: string[];
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; }

export interface StyleFilters {
  search?: string;
  gender?: Gender;
  wearCategory?: WearCategory;
  brickName?: string;
  fabricUsed?: string;
  fabricContent?: string;
  gsmMin?: number;
  gsmMax?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface FabricFilters {
  search?: string;
  brickName?: string;
  fabricUsed?: string;
  fabricContent?: string;
  supplierName?: string;
  gsmMin?: number;
  gsmMax?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  styles: Style[];
  fabrics: Fabric[];
  total: number;
}
