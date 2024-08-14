// contact-form.component.ts

import { ApplicationModule, Component, } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormGroup} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/api.service'; 
import { API_ENDPOINTS } from 'src/api.constants';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';







@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  standalone: true,
  imports: [MatFormFieldModule,HttpClientModule, MatInputModule, FormsModule, ReactiveFormsModule,CommonModule],
  providers: [ApiService]
})
export class ContactFormComponent{
    contactForm: FormGroup;
    email = new FormControl('', [Validators.required, Validators.email]);
  
    constructor(private fb: FormBuilder, private apiService: ApiService, private snackBar: MatSnackBar) {
      this.contactForm = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        phone_number: ['', Validators.required],
        email: ['', [Validators.required,Validators.email]],
        message: ['', Validators.required]
        
      });
    }
    getErrorMessage() {
        const emailControl = this.contactForm.get('email');
      
        if (emailControl?.hasError('required')) {
          return 'You must enter a value';
        }
      
        return emailControl?.hasError('email') ? 'Not a valid email' : '';
      }
      isFormValid() {
        console.log('Form Status:', this.contactForm.status);
        // Check if all fields are valid
        return this.contactForm.valid;
      }
      onSubmit() {
        console.log('Form Status:', this.contactForm.status);
        if (this.isFormValid()) {
          const formData = this.contactForm.value;
    
          // Make a POST request to your backend API
          this.apiService.post(API_ENDPOINTS.submitContactForm, formData).subscribe(
            (response) => {
              // Handle successful response, you can display a success message or redirect to another page
              console.log('API Response:', response);
              this.snackBar.open('Form submitted successfully!', 'Close', { duration: 3000 });
              this.contactForm.reset();
            },
            (error) => {
              // Handle error, you can display an error message
              console.error('API Error:', error);
              this.snackBar.open('Error submitting form. Please try again later.', 'Close', { duration: 3000 });
            }
          );
        } else {
          // Display a message to the user to fill in the required fields
          this.snackBar.open('Please fill in all required fields before submitting.', 'Close', { duration: 3000 });
        }
      }
    }     

