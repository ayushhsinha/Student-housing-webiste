import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-sell-home',
  standalone: true,
  imports: [HttpClientModule, RouterModule],
  templateUrl: './sellahome.component.html',
  styleUrls: ['./sellahome.component.css'],
  providers: [ApiService]
})
export class SellHomeComponent  {
  constructor(private apiService: ApiService, private router: Router) {}
}
