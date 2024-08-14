import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-buy-home',
  standalone: true,
  imports: [HttpClientModule, RouterModule],
  templateUrl: './buyahome.component.html',
  styleUrls: ['./buyahome.component.css'],
  providers: [ApiService]

})
export class BuyHomeComponent  {
  constructor(private apiService: ApiService, private router: Router) {}

}
