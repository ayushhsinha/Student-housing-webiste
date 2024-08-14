import { Component } from '@angular/core';
import { HeaderComponent } from '../home/HomePage/header/header.component';
import { WHYUSComponent } from '../home/HomePage/whyus/whyus.component';
import { SliderComponent } from '../home/HomePage/slider/slider.component';
import { MainImageComponent } from '../home/HomePage/main-image/main-image.component';
import { MapComponent } from '../map/map.component';
import { ContactFormComponent } from 'src/app/contact-form/contact-form.component';
import { HttpClientModule } from '@angular/common/http';

import { ImageCarouselComponent } from 'src/app/image-carousel/image-carousel.component';

import { FooterModule } from './HomePage/footer/footer.module';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    WHYUSComponent,
    SliderComponent,
    MainImageComponent,
    MapComponent,
    ContactFormComponent,
    HttpClientModule,
    FooterModule,
  ImageCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
