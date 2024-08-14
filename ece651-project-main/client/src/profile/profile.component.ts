import { ApplicationModule, Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/api.service';
import { API_ENDPOINTS } from 'src/api.constants';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../home/HomePage/header/header.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/auth.service';
import { Router } from '@angular/router';
import { Booking, BookingResponse, User } from './bookings.model';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, DatePipe],
  providers: [ApiService, AuthService, DatePipe],
})
export class ProfileComponent {
  user: User | null = null;
  bookings: BookingResponse = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    if (!this.authService.getisLoggedIn()) {
      this.router.navigate(['login']);
    }

    apiService.get('/auth/profile').subscribe(
      (data: User) => {
        this.user = data;
        console.log(this.user);
      },
      (error) => {
        this.authService.removeUser();
        this.router.navigate(['login']);
        console.error(error);
      }
    );

    this.getAllBookings();
  }

  deleteBooking(bookingId: string) {
    this.apiService.delete(`/bookings/delete/${bookingId}`).subscribe(
      (data) => {
        this.getAllBookings();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getAllBookings() {
    this.apiService.get('/bookings/list').subscribe(
      (data: BookingResponse) => {
        // Sample data
        /*
        this.bookings = [
          {
            booking: {
              public_id: '2ab83e61-bc77-4c33-bfef-5ade23e6ef27',
              start_date: '2023-01-01',
              end_date: '2023-01-02',
              room_id: '1',
              status: 'pending',
            },
            unit: {
              public_id: '1',
              name: 'Apt. 926',
              building: '7a2fb2cd-f000-4911-be20-996a559de9b6',
            },
            pictures: [
              'https://myrez.imgix.net/2020/12/Fitness-Room-01-myREZ-on-Lester.jpg?auto=format&fit=&h=auto&ixlib=php-3.2.0&w=1136&s=415e925c68aacc12a5928df432768cce',
            ],
            property_name: 'Delbert Divide',
          },
          {
            booking: {
              public_id: '2ab83e61-bc77-4c33-bfef-5ade23e6ef27',
              start_date: '2023-01-01',
              end_date: '2023-01-02',
              room_id: '1',
              status: 'pending',
            },
            unit: {
              public_id: '1',
              name: 'Apt. 926',
              building: '7a2fb2cd-f000-4911-be20-996a559de9b6',
            },
            pictures: [
              'https://myrez.imgix.net/2020/12/Fitness-Room-01-myREZ-on-Lester.jpg?auto=format&fit=&h=auto&ixlib=php-3.2.0&w=1136&s=415e925c68aacc12a5928df432768cce',
            ],
            property_name: 'Delbert Divide',
          },
        ];
        */
        this.bookings = data;
        this.bookings.forEach((booking) => {
          booking.bookings.start_date =
            this.datePipe.transform(
              booking.bookings.start_date,
              'mediumDate'
            ) ?? booking.bookings.start_date;
          booking.bookings.end_date =
            this.datePipe.transform(booking.bookings.end_date, 'mediumDate') ??
            booking.bookings.end_date;
        });
        console.log(this.bookings);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
