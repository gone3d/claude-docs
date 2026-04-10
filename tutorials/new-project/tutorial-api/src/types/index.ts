export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreate {
  title: string;
  description?: string;
  categoryId?: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  categoryId?: number;
}

export interface Category {
  id: number;
  name: string;
  createdAt: Date;
}

export interface CategoryCreate {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
