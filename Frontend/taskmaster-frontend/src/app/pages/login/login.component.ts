import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ✅ adjust path if needed

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}  // ✅ inject here

  ngOnInit() {
    console.log('LoginComponent initialized');
    console.log('Token:', this.authService.getToken());
  
    if (this.authService.isLoggedIn()) {
      console.log('Redirecting to dashboard...');
      this.router.navigate(['/dashboard']);
    }
  }
  

  signInWithGoogle() {
    this.authService.signInWithGoogle();  // ✅ now it won’t complain
  }
}
