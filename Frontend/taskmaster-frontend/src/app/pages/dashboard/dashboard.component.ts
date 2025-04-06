import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{
    constructor(
      private route: ActivatedRoute,
      private authService: AuthService,
      private router: Router,
    ) {}

    ngOnInit(): void {
      this.route.queryParams.subscribe((params) => {
        const token = params['token'];
        if(token){
          this.authService.setToken(token); // stores token
          this.router.navigate([],{queryParams: {}}); // clears token from URL for better clean URL look
        }
      })
    }
}
