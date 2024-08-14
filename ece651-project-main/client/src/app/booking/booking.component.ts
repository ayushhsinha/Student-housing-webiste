import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FooterModule } from 'src/home/HomePage/footer/footer.module';
import { HeaderComponent } from 'src/home/HomePage/header/header.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PropertyDialogComponent } from '../property-dialog/property-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    MatIconModule,
    HeaderComponent,
    FooterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  contactinfoForm!: FormGroup;
  roomId: string;
  roomName: string;
  roomPrice: number;

  electricCharges: number;
  serviceFee: number;
  taxes: number;

  constructor(public dialog: MatDialog) {
    this.roomId = history.state.id;
    this.roomName = history.state.name;
    this.roomPrice = Number(history.state.price);

    this.electricCharges = this.roomPrice * 0.08;
    this.serviceFee = this.roomPrice * 0.05;
    this.taxes = this.roomPrice * 0.0545;
  }

  ngOnInit(): void {
    this.contactinfoForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      leaseStartDate: new FormControl('', Validators.required),
      university: new FormControl('', Validators.required),
    });
  }

  openDialog() {
    this.dialog.open(PropertyDialogComponent);
  }

  onSubmit() {
    if (this.contactinfoForm.valid) {
      console.log(this.contactinfoForm.value);
      // Proceed with your form submission logic here, like sending the data to a backend server
    }
  }
}
