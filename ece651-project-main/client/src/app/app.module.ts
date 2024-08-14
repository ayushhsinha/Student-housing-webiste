import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AgentsComponent } from 'src/agents/agents.component';
import { ApiService } from 'src/api.service';
import { HomeComponent } from '../home/home.component';
import { PropertiesComponent } from '../properties/properties.component';
import { AppRoutingModule } from './app.routes';
import { RouterModule } from '@angular/router'; // Import RouterModule here
import { ContactComponent } from 'src/contact/contact.component';
import { ReviewsComponent } from 'src/reviews/reviews.component';
import { AccountComponent } from 'src/account/account.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { HammerModule } from '@angular/platform-browser';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        PropertiesComponent,
        ContactFormComponent,
        AgentsComponent,
        ImageCarouselComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        // ContactFormComponent,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        RouterModule,
        FormsModule,
        CarouselModule.forRoot(),
        HammerModule
        
    ],
    providers: [ApiService],
    bootstrap: [AppComponent]
})
export class AppModule { }