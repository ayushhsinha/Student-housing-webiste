import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { BookingComponent } from './booking.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Validators } from '@angular/forms';

@Component({ selector: 'app-property-dialog', template: '' })
class PropertyDialogComponentMock {}

// Mock MatDialog service
class MatDialogMock {
  open(): MatDialogRef<any> {
    return jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
  }
}

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PropertyDialogComponentMock],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock }, 
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'mockedParam' } },
            queryParams: of({}),
            params: of({}),
          },
        }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges(); 

  });

  it('should initialize the contactinfoForm FormGroup with default values', () => {
    const defaultFormValues = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      leaseStartDate: '',
      university: ''
    };

    // Assert
    expect(component.contactinfoForm).toBeDefined();
    expect(component.contactinfoForm.value).toEqual(defaultFormValues);
  });
  
  it('should set firstName as required field', () => {
    expect(component.contactinfoForm.get('firstName')?.hasError('required')).toBeTruthy();
  });

  it('should set email as required field', () => {
    expect(component.contactinfoForm.get('email')?.hasError('required')).toBeTruthy();
  });

  it('should set email as invalid if not in correct email format', () => {
    const invalidEmail = 'invalid-email';
    component.contactinfoForm.patchValue({ email: invalidEmail });
    expect(component.contactinfoForm.get('email')?.hasError('email')).toBeTruthy();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the contactinfoForm FormGroup', () => {
    fixture.detectChanges();
    expect(component.contactinfoForm).toBeDefined();
    expect(component.contactinfoForm instanceof FormGroup).toBeTruthy();
  });


});
