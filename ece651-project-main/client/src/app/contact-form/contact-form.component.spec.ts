import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';


import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { API_ENDPOINTS } from 'src/api.constants';

import { HttpTestingController } from '@angular/common/http/testing';

import { FormGroup} from '@angular/forms';
import { FormBuilder } from '@angular/forms';





describe('ContactFormComponent', () => {
    let component: ContactFormComponent;
    let fixture: ComponentFixture<ContactFormComponent>;
    let mockApiService: jasmine.SpyObj<ApiService>;
    let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
    let httpTestingController: HttpTestingController;

  beforeEach(
    waitForAsync(() => {
        mockApiService = jasmine.createSpyObj('ApiService', ['post']);
      mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);


    TestBed.configureTestingModule({
        // declarations: [ContactFormComponent],
        imports: [ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        BrowserAnimationsModule],
        providers: [
            { provide: MatSnackBar, useValue: mockSnackBar },
            { provide: ApiService, useValue: mockApiService },
          ],
        }).compileComponents();
        httpTestingController = TestBed.inject(HttpTestingController);
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form initially', () => {
    expect(component.contactForm.valid).toBeFalsy();
  });

  it('should return false for an invalid form', () => {
    component.contactForm.get('email')?.setValue('invalid-email');
    expect(component.isFormValid()).toBeFalsy();
  });

  it('should return error message for required email', () => {
    component.contactForm.get('email')?.setValue(''); // Set email to an empty value

    const errorMessage = component.getErrorMessage();

    expect(errorMessage).toBe('You must enter a value');
  });

  it('should return error message for invalid email format', () => {
    component.contactForm.get('email')?.setValue('invalid-email');

    const errorMessage = component.getErrorMessage();

    expect(errorMessage).toBe('Not a valid email');
  });
  
  it('should display a message when form is invalid', fakeAsync(() => {
    // Make the form invalid
    component.contactForm.get('email')?.setValue('invalid-email');

    component.onSubmit();

    // Expect the form not to be reset
    expect(component.contactForm.value).not.toEqual({
      firstname: '',
      lastname: '',
      phone_number: '',
      email: '',
      message: '',
    });

    // Expect the MatSnackBar to be called with the error message
    expect(mockSnackBar.open).toHaveBeenCalledWith('Please fill in all required fields before submitting.', 'Close', { duration: 3000 });

    // No HTTP requests are expected in this case
    httpTestingController.expectNone(API_ENDPOINTS.submitContactForm);
  }));
});




  