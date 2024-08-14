import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
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
import { ApiService } from '../api.service';
import { API_ENDPOINTS } from '../api.constants';
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

@Component({
  selector: 'app-login',
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
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [ApiService, AuthService],
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;
  fillData = false;
  activeButton: 'login' | 'signup' = 'login';
  isLoggedIn: boolean;
  constructor(
    private router: Router,
    private ApiService: ApiService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.isLoggedIn = this.authService.getisLoggedIn();
    if (this.isLoggedIn == true) {
      this.router.navigate(['home']);
    }
  }
  toggleButton(button: 'login' | 'signup') {
    this.activeButton = button;
    if (button == 'signup') {
      this.navigateToSignup();
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
  openDialog() {
    this.dialog.open(DialogComponent);
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorPassword() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('password') ? 'Not a valid email' : '';
  }

  login() {
    this.fillData = false;
    let ErrorMessage;
    const postData = { email: this.email.value, password: this.password.value };
    if (postData.email != '' && this.email.valid && postData.password != '') {
      this.ApiService.post(API_ENDPOINTS.login, postData).subscribe(
        (response) => {
          console.log(response);
          this.authService.setUser().then(() => {
            this.email.setValue('');
            this.password.setValue('');
            this.isLoggedIn = true;
            this.router.navigate(['home']);
          });
        },
        (error) => {
          this.email.setValue('');
          this.password.setValue('');
          this.dialog.open(DialogComponent);
        }
      );
    } else {
      this.fillData = true;
      this.openDialog();
    }
  }
}
