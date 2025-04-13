import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common' 


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule], // ✅ add CommonModule here
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
   user: any;
   constructor(private auth:AuthService, private http: HttpClient) {}
   ngOnInit(): void {
    const token = this.auth.getToken();
    if(token){
      this.http.get('http://localhost:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}`},
      }).subscribe({
        next: (data) => this.user = data,
        error: (err) => console.error(err),
      });
    }
   }
}
