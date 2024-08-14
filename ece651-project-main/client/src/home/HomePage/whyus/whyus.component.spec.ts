import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WHYUSComponent } from './whyus.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from 'src/api.service';
import { of, throwError } from 'rxjs';

describe('WHYUSComponent', () => {
  let component: WHYUSComponent;
  let fixture: ComponentFixture<WHYUSComponent>;
  let apiService: ApiService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [], // Correctly declare the component here
      imports: [WHYUSComponent, HttpClientModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '123' })
            }
          }
        },
        ApiService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WHYUSComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the WHYUSComponent', () => {
    expect(component).toBeTruthy();
  });

  
 
});
