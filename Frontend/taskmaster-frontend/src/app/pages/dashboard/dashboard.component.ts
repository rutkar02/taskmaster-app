import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth.service';
import { TaskService } from '../../../app/services/task.service';
import { Task } from '../../../app/models/task.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = {
    title: '',
    description: ''
  }
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService
  ) {}

  editedTaskId: string | null = null;
  editTitle: string = '';
  editDescription: string = '';
  editStatus: 'pending' | 'completed' = 'pending';
  showModal = false;

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
      next: (tasks) => (this.tasks = tasks),
      error: (err) => console.error('Failed to load tasks', err),
    });
  }

  addTask(): void {
    if( !this.newTask.title || !this.newTask.description) return;

    this.taskService.createTasks(this.newTask).subscribe({
      next: (task) =>{
        this.tasks.push(task);  // Add new task to the list
        this.newTask = { title: '' , description: ''}; // reset the form
      },
      error: (err) => console.error(err)
    })
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
  }

  cancelEdit(): void{
    this.editedTaskId = null;
  }

  updateTask(id: string): void{
    const updated = {
      title: this.editTitle,
      description: this.editDescription,
      status: this.editStatus
    };

    this.taskService.updateTask(id, updated).subscribe({
      next: () =>{
        this.loadTasks(); // refreshes
        this.cancelEdit(); // exit edit mode
      },
      error: err => console.error(err)
    });
  }

  openModal(){
    this.showModal = true;
  }

  closeModal(){
    this.showModal = false;
  }

  onTaskAdded(){
    this.loadTasks();
  }
}
