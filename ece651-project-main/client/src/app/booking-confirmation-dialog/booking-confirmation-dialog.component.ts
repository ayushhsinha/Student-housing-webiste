import { Component } from '@angular/core';
import { MatDialogModule, matDialogAnimations } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { ApiService } from '../api.service';
// import { API_ENDPOINTS } from '../api.constants';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from 'src/dialog/dialog.component';
import { AuthService } from 'src/auth.service';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ApiService } from 'src/api.service';
import { HeaderComponent } from 'src/home/HomePage/header/header.component';
import { FooterModule } from 'src/home/HomePage/footer/footer.module';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-booking-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule,MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './booking-confirmation-dialog.component.html',
  styleUrl: './booking-confirmation-dialog.component.css',
})
export class BookingConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BookingConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Assuming data is passed into the dialog with these properties
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  //   navigateToNextPage() {
  //     const id = this.route.snapshot.paramMap.get('id');
  //     const name = this.route.snapshot.queryParamMap.get('name');
  //     const price = this.route.snapshot.queryParamMap.get('price');

  //     this.router.navigate(['/booking/'], {
  //       state: { id, name, price }
  //     });
  //   }

  onNoClick(): void {
    // Assuming you are fetching 'id', 'name', and 'price' from the current route in this component

    const name = this.route.snapshot.queryParamMap.get('name');
    const price = this.route.snapshot.queryParamMap.get('price');
    const id = this.route.paramMap;
    console.log(`${JSON.stringify(id)}`);
    // Navigate to '/target-page' with 'id' as a route parameter and 'name', 'price' as query parameters
    this.router.navigate(['bookings'], {
      queryParams: { name: name, price: price },
    });

    this.dialogRef.close();
  }
}
