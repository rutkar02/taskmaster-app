import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.scss'
})
export class AddTaskModalComponent {
  @Output() taskAdded = new EventEmitter<void>();
  @Output() closeModel = new EventEmitter<void>();
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService){
    this.taskForm = this.fb.group({
      title: ['',Validators.required],
      description: [''],
      status: ['pending', Validators.required],
    });
  }

  onSubmit(): void{
    if(this.taskForm.valid){
      this.taskService.createTasks(this.taskForm.value).subscribe({
        next: () =>{
        this.taskAdded.emit();
        this.closeModel.emit();
        },
        error: (err) => console.error('Error creating task: ', err)
      })
    }
  }  

  onClose(): void{
    this.closeModel.emit();
  }
}
