import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { API_ENDPOINTS } from '../api.constants';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from 'src/dialog/dialog.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { Loader } from '@googlemaps/js-api-loader';
import { ChangeDetectorRef } from '@angular/core';


import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

interface Location {
  property_name: string;
  latitude: string;
  longitude: string;
}

declare const L: any;

interface Location {
  property_name: string;
  latitude: string;
  longitude: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, HttpClientModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  providers: [ApiService]
})

export class MapComponent implements OnInit {
  selectedImageUrl: string | null = null;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchDataAndRenderMap();
  }

  fetchDataAndRenderMap(): void {
    this.apiService.get(API_ENDPOINTS.maplocation).subscribe(
      (data: Location[]) => {
        const latitudes: string[] = this.getLatitudes(data);
        const longitudes: string[] = this.getLongitudes(data);
        const propertyNames: string[] = this.getPropertyNames(data);

        this.renderMap(latitudes, longitudes, propertyNames);
      },
      (error) => {
        console.error('Error accessing the API!');
      }
    );
  }

  getLatitudes(data: Location[]): string[] {
    return data.map((location: Location) => location.latitude);
  }

  getLongitudes(data: Location[]): string[] {
    return data.map((location: Location) => location.longitude);
  }

  getPropertyNames(data: Location[]): string[] {
    return data.map((location: Location) => location.property_name);
  }

  renderMap(latitudes: string[], longitudes: string[], propertyNames: string[]) {
    const mymap = L.map('map').setView([latitudes[0], longitudes[0]], 11.5);

    this.addTileLayerToMap(mymap);

    for (let i = 0; i < latitudes.length; i++) {
      this.addMarkerToMap(mymap, latitudes[i], longitudes[i], propertyNames[i], i);
    }

    this.addCircleToMap(mymap, latitudes[9], longitudes[9]);
  }

  addTileLayerToMap(mymap1: any) {
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1hbmR1dHRiaGFnYXQiLCJhIjoiY2xzcW5kcXpsMTI1cTJpdGdtODF3ejNuZSJ9.xO6q7CEcs32-Y-l8LQ_uNg',
      {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYW1hbmR1dHRiaGFnYXQiLCJhIjoiY2xzcW5kcXpsMTI1cTJpdGdtODF3ejNuZSJ9.xO6q7CEcs32-Y-l8LQ_uNg',
      }
    ).addTo(mymap1);
  }

  addMarkerToMap(mymap: any, latitude: string, longitude: string, propertyName: string, index: number) {
    const marker = L.marker([latitude, longitude]).addTo(mymap);
    marker.bindPopup(`<h3>${propertyName}</h3><img src="assets/home_images/home_${index % 7 === 0 ? 1 : index % 7}.jpg" alt="${propertyName}" style="width:100px;height:80px;">`);

    marker.on('mouseover', () => {
      marker.openPopup();
    });

    marker.on('mouseout', () => {
      marker.closePopup();
    });
  }

  addCircleToMap(mymap: any, latitude: string, longitude: string) {
    const circle = L.circle([latitude, longitude], {
      color: 'white',
      fillColor: '#ffffff',
      fillOpacity: 0.2,
      radius: 1000
    }).addTo(mymap).bindPopup(`<h3>University of Waterloo</h3><img src="assets/home_images/University-of-Waterloo.jpg" alt="University of Waterloo" style="width:100%;height:auto;">`);

    circle.on('mouseover', () => {
      circle.openPopup();
    });

    circle.on('mouseout', () => {
      circle.closePopup();
    });
  }
}