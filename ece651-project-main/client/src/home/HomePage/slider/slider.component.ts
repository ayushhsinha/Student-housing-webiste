import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})

export class SliderComponent {
  constructor(private router: Router) {}
  currentProjectIndex = 0;
  currentProjectName = 'Justina Mountains'; // Initial project name
  projects = [
    { id: 1, name: 'Justina Mountains', image: './assets/11.png' },
    { id:2, name: 'Nitzsche Loaf', image: './assets/2.png' },
  ];

  prevProject() {
    if (this.currentProjectIndex > 0) {
      this.currentProjectIndex--;
      this.currentProjectName = this.projects[this.currentProjectIndex].name;
    }
  }

  nextProject() {
    if (this.currentProjectIndex < this.projects.length - 1) {
      this.currentProjectIndex++;
      this.currentProjectName = this.projects[this.currentProjectIndex].name;
    }
  }

  viewProject() {
    const projectId = this.projects[this.currentProjectIndex].id;
    this.router.navigate(['/properties', projectId]);
  }

}
