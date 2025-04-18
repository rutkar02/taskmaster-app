import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms'; // Import NgForm for form validation

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule], // ✅ add CommonModule here
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  message: string = '';

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
    if (token) {
      this.http.get('http://localhost:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).subscribe({
        next: (data) => this.user = data,
        error: (err) => console.error(err),
      });
    }
  }

  updateProfile(): void {
    const token = this.auth.getToken();
    if (token) {
      this.http.put('http://localhost:5000/api/user/update', this.user, {
        headers: { Authorization: `Bearer ${token}` },
      }).subscribe({
        next: (response) => {
          this.message = 'Profile updated successfully!';
        },
        error: (err) => {
          this.message = 'Failed to update profile. Please try again.';
          console.error(err);
        }
      });
    }
  }
}
