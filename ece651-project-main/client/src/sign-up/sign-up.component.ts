import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/api.service';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from 'src/dialog/dialog.component';
import { API_ENDPOINTS } from '../api.constants';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [ApiService],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
  ],
})
export class SignUpComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  firstname = new FormControl('', [Validators.required]);
  lastname = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  confirmpassword = new FormControl('', [Validators.required]);

  hide = true;
  hide2 = true;
  fillData = true;
  activeButton: 'login' | 'signup' = 'signup';
  constructor(private router: Router, private apiService: ApiService, public dialog: MatDialog) {

  }

  toggleButton(button: 'login' | 'signup') {
    this.activeButton = button;
    if (button == 'login') {
      this.navigateToSignup();
    }

  }

  openDialog() {
    this.dialog.open(DialogComponent);
  }

  navigateToSignup() {
    this.router.navigate(['/login']);
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorfirstname() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getErrorlastname() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getErrorpassword() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getErrorconfirmpassword() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  signup() {
    this.fillData = false;
    const postData = { firstname: this.firstname.value, lastname: this.lastname.value, email: this.email.value, password: this.password.value, confirmpassword: this.confirmpassword.value };
    if (this.email.valid && this.password.valid && this.confirmpassword.valid && this.firstname.valid && this.lastname.valid && this.password.value == this.confirmpassword.value) {
      this.apiService.post(API_ENDPOINTS.signup, postData).subscribe(
        (response) => {
          this.router.navigate(['login']);
        },
        (error) => {
          this.openDialog();
          // console.error('Error:', error);
        }
      );
      this.email.setValue('');
      this.password.setValue('');
      this.firstname.setValue('');
      this.lastname.setValue('');
      this.confirmpassword.setValue('');
    }
    else {
      this.fillData = true;
      this.openDialog();
    }

  }
}
