import { SignUpComponent } from './sign-up.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ApiService } from 'src/api.service';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from 'src/api.constants';
import { throwError } from 'rxjs';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let apiService: ApiService;
  let dialog: MatDialog;
  let router: Router;

  const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [], // No declarations here
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
      providers: [
        ApiService,
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.email).toBeDefined();
    expect(component.firstname).toBeDefined();
    expect(component.lastname).toBeDefined();
    expect(component.password).toBeDefined();
    expect(component.confirmpassword).toBeDefined();
  });

  it('should navigate to login on toggleButton', () => {
    component.toggleButton('login');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to login on navigateToSignup', () => {
    component.navigateToSignup();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should open dialog on openDialog', () => {
    component.openDialog();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should set hide to true initially', () => {
    expect(component.hide).toBeTrue();
  });
  
  it('should set hide2 to true initially', () => {
    expect(component.hide2).toBeTrue();
  });
  
  it('should set activeButton to "signup" initially', () => {
    expect(component.activeButton).toEqual('signup');
  });
  
  it('should reset form controls after successful signup', () => {
    spyOn(apiService, 'post').and.returnValue(of({}));
    component.email.setValue('test@example.com');
    component.firstname.setValue('Test');
    component.lastname.setValue('User');
    component.password.setValue('password');
    component.confirmpassword.setValue('password');
  
    component.signup();
  
    expect(component.email.value).toEqual('');
    expect(component.firstname.value).toEqual('');
    expect(component.lastname.value).toEqual('');
    expect(component.password.value).toEqual('');
    expect(component.confirmpassword.value).toEqual('');
  });
  
  it('should not call apiService.post on signup if form is invalid', () => {
    spyOn(apiService, 'post').and.returnValue(of({}));
    component.signup();
    expect(apiService.post).not.toHaveBeenCalled();
  });
  
  it('should not call apiService.post on signup if passwords do not match', () => {
    spyOn(apiService, 'post').and.returnValue(of({}));
    component.email.setValue('test@example.com');
    component.firstname.setValue('Test');
    component.lastname.setValue('User');
    component.password.setValue('password');
    component.confirmpassword.setValue('differentPassword');
  
    component.signup();
  
    expect(apiService.post).not.toHaveBeenCalled();
  });
  
  it('should not navigate to login if form submission fails', () => {
    spyOn(apiService, 'post').and.returnValue(throwError(new Error('Error')));
    component.signup();
    expect(dialog.open).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
  
  
  it('should not navigate to login if passwords do not match', () => {
    component.email.setValue('test@example.com');
    component.firstname.setValue('Test');
    component.lastname.setValue('User');
    component.password.setValue('password');
    component.confirmpassword.setValue('differentPassword');
  
    component.signup();
    expect(router.navigate).not.toHaveBeenCalled();

  });
  
  
  it('should open dialog if form submission fails', () => {
    spyOn(apiService, 'post').and.returnValue(throwError('Error'));
    component.signup();
    expect(dialog.open).toHaveBeenCalled();
  });
  
});
