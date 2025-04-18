import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent], // ✅ only import standalone components/modules
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      console.log('Token from URL:', token);
      if (token) {
        this.authService.setToken(token);
        console.log('Token saved to localStorage!');
        this.router.navigate(['/dashboard']); // navigate after storing token
      } else {
        console.log('No token found in URL');
      }
    });
  }

  showNavbar() {
    return location.pathname !== '/';
  }
}
