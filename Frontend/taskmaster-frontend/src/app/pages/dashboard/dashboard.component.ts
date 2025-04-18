import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth.service';
import { TaskService } from '../../../app/services/task.service';
import { Task } from '../../../app/models/task.model';
import { CommonModule } from '@angular/common'; // 👈 for *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // 👈 for [(ngModel)]
import { AddTaskModalComponent } from '../../components/add-task-modal/add-task-modal.component';
import { TaskStatsComponent } from '../../components/task-stats/task-stats.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    AddTaskModalComponent,
    TaskStatsComponent,
  ], // ✅ add this
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = {
    title: '',
    description: '',
  };
  editedTaskId: string | null = null;
  editTitle: string = '';
  editDescription: string = '';
  editStatus: 'pending' | 'completed' = 'pending';
  showModal = false;
  filterStatus: string = '';
  filteredTasks: any[] = [];
  editDueDate: string = '';
  showOnlyUpcoming: boolean = false;
  filterPriority: string = '';
  editPriority: 'low' | 'medium' | 'high' = 'medium';
  searchQuery: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.authService.setToken(token);
        this.router.navigate([], { queryParams: {} });
      }
    });

    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.sort(
          (a: Task, b: Task) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        this.applyFilter(); // apply filter after applying filter
      },
      error: (err) => console.error('Failed to load tasks', err),
    });
  }

  addTask(): void {
    if (!this.newTask.title || !this.newTask.description) return;

    this.taskService.createTasks(this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task); // Add new task to the list
        this.newTask = { title: '', description: '' }; // reset the form
      },
      error: (err) => console.error(err),
    });
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
      },
      error: (err) => console.error('Delete failed', err),
    });
  }

  editTask(task: Task): void {
    this.editedTaskId = task._id;
    this.editTitle = task.title;
    this.editDescription = task.description;
    this.editStatus = task.status;
    this.editDueDate = task.dueDate ?? '';
    this.editPriority = task.priority || 'medium';
  }

  cancelEdit(): void {
    this.editedTaskId = null;
  }

  updateTask(id: string): void {
    const updated = {
      title: this.editTitle,
      description: this.editDescription,
      status: this.editStatus,
      dueDate: this.editDueDate,
      priority: this.editPriority,
    };

    this.taskService.updateTask(id, updated).subscribe({
      next: () => {
        this.loadTasks(); // refreshes
        this.cancelEdit(); // exit edit mode
      },
      error: (err) => console.error(err),
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onTaskAdded() {
    this.loadTasks();
  }

  get completedTasksCount(): number {
    return this.tasks.filter((task) => task.status === 'completed').length;
  }

  get pendingTasksCount(): number {
    return this.tasks.filter((task) => task.status !== 'completed').length;
  }

  applyFilter() {
    this.filteredTasks = this.tasks.filter((task) => {
      const statusMatch =
        !this.filterStatus || task.status === this.filterStatus;
      const priorityMatch =
        !this.filterPriority || task.priority === this.filterPriority;
      const upcomingMatch =
        !this.showOnlyUpcoming ||
        (task.dueDate && new Date(task.dueDate) > new Date());
      const searchMatch =
        !this.searchQuery ||
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      return statusMatch && priorityMatch && upcomingMatch && searchMatch;
    });
  }

  onTasksAdded() {
    this.loadTasks();
  }

  onStatusChange(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  markAsCompleted(taskId: string): void {
    this.taskService.updateTask(taskId, { status: 'completed' }).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to update task status', err),
    });
  }
}
