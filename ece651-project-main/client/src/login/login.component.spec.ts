
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { API_ENDPOINTS } from 'src/api.constants';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['post']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    })
    .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to signup page', () => {
    const navigateSpy = spyOn(component, 'navigateToSignup').and.callThrough();
    component.navigateToSignup();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should open dialog', () => {
    component.openDialog();
    expect(mockMatDialog.open).toHaveBeenCalled();
  });

  it('should return correct email error message', () => {
    component.email.setValue('');
    expect(component.getErrorMessage()).toEqual('You must enter a value');

    component.email.setValue('invalidemail');
    expect(component.getErrorMessage()).toEqual('Not a valid email');
  });

  it('should return correct password error message', () => {
    component.password.setValue('');
    expect(component.getErrorPassword()).toEqual('You must enter a value');
  });

  it('should not call login and open dialog on invalid input', () => {
    component.login();
    expect(mockApiService.post).not.toHaveBeenCalled();
    expect(mockMatDialog.open).toHaveBeenCalled();
  });

});