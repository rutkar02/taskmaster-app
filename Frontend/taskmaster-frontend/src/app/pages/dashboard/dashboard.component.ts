import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    dummyTasks=[
      {title: 'Task1', description: 'Code for 4 hours'},
      {title: 'Task2', description: 'Read book for an hour'},
    ];
}
