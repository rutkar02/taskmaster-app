import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ add this
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}
  userName: string | null = null;

  logout(): void {
    this.authService.logout(); // Call the service
    this.router.navigate(['/login']); // Redirect to login page
  }

  ngOnInit() {
    const user = this.authService.getUserInfo();
    this.userName = user?.name || null;
  }
}
