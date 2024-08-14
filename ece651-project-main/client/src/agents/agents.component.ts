import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css'],
  providers: [ApiService]
})
export class AgentsComponent implements OnInit {
  agents: any[] = []; // Array to hold agent data

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.loadPartnerLocations();
  }

  loadPartnerLocations() {
    this.apiService.getPartnerLocations().subscribe(
      (data: any) => { // Accept any type of data
        this.agents = data;
      },
      error => {
        console.error('Error fetching partner locations', error);
      }
    );
  }
  
}
