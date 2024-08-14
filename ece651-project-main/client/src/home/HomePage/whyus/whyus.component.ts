import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/api.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-whyus',
  standalone: true,
  imports: [HttpClientModule, RouterModule],
  templateUrl: './whyus.component.html',
  styleUrl: './whyus.component.css',
  providers: [ApiService]
})
export class WHYUSComponent {
  constructor(private apiService: ApiService, private router: Router) {}
  navigateAndFetch(endpoint: string): void {
    this.apiService.get(endpoint).subscribe({
      next: (response) => {
        console.log('Data fetched for', endpoint, response);
        this.router.navigate([endpoint]);
      },
      error: (error) => {
        console.error('Failed to fetch data for', endpoint, error);
      }
    });
}}
