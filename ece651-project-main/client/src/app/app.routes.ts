import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '../account/account.component';
import { ContactComponent } from '../contact/contact.component';

import { AgentsComponent } from '../agents/agents.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { PropertiesComponent } from '../properties/properties.component';
import { HomeComponent } from '../home/home.component';
import { SignUpComponent } from 'src/sign-up/sign-up.component';
import { LoginComponent } from '../login/login.component';
import { SellHomeComponent } from 'src/home/HomePage/sellahome/sellahome.component';
import { BuyHomeComponent } from 'src/home/HomePage/buyahome/buyahome.component';
import { RentHomeComponent } from 'src/home/HomePage/rentahome/rentahome.component';
import { MapComponent } from 'src/map/map.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ProfileComponent } from 'src/profile/profile.component';
import { BookingComponent } from './booking/booking.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'properties/:id', component: PropertiesComponent},
  { path: 'properties/:propertyName', component: PropertiesComponent},

  { path: 'bookings', component: BookingComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'account', component: AccountComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'buying', component: BuyHomeComponent },
  { path: 'selling', component: SellHomeComponent },
  { path: 'renting', component: RentHomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contact-form', component: ContactFormComponent },
  { path: 'rooms/:id', component: ImageCarouselComponent },
  {path:'picture/:id', component:ImageCarouselComponent},
    {path: 'image-carousel', component:ImageCarouselComponent}
];

export class AppRoutingModule {}
