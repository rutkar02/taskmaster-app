export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'completed';
    userId: string;
    dueDate: string;
    priority?: 'high' | 'medium' | 'low';
  }
  