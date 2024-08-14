import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-rent-home',
  standalone: true,
  imports: [HttpClientModule, RouterModule],
  templateUrl: './rentahome.component.html',
  styleUrls: ['./rentahome.component.css'],
  providers: [ApiService]

})
export class RentHomeComponent {
  constructor(private apiService: ApiService, private router: Router) {}

}
