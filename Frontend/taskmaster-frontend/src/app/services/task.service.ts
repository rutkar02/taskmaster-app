import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';
  constructor(private http:HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders()});
  }
  
  createTasks(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task,{headers: this.getAuthHeaders()});
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task, {headers: this.getAuthHeaders()});
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {headers: this.getAuthHeaders()});
  }
}
