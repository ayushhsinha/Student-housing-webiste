import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [], // Import HttpClientModule
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'] // Corrected styleUrl to styleUrls
})
export class ReviewsComponent {

}
