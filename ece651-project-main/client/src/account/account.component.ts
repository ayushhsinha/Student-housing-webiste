import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [], 
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'] 
})
export class AccountComponent {
  accountDetails: any; 
}
