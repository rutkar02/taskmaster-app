import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-stats.component.html',
  styleUrl: './task-stats.component.scss'
})
export class TaskStatsComponent {
      @Input() totalTasks: number = 0;
      @Input() completedTasks: number = 0;
      @Input() pendingTasks: number = 0;
}
