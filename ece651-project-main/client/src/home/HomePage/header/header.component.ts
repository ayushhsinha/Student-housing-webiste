import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/auth.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../api.service';
import { API_ENDPOINTS } from 'src/api.constants';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ApiService, AuthService],
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private ApiService: ApiService,
    private router: Router
  ) {}

  login(): void {
    this.authService.setUser();
  }

  logout(): void {
    if (this.authService.getisLoggedIn()) {
      this.ApiService.post(API_ENDPOINTS.logout, {}).subscribe((response) => {
        this.authService.removeUser();
        this.router.navigate(['home']);
      });
    }
  }

  profile(): void {
    if (this.authService.getisLoggedIn()) {
      this.router.navigate(['profile']);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.getisLoggedIn();
  }

  getName(): string | undefined {
    return this.authService.getUser()?.firstname;
  }
}
