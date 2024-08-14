import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesComponent } from './properties.component';
import { ApiService } from 'src/api.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: Router;
  let mockActivatedRoute;
  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['get']);
    mockActivatedRoute = {
      params: of ({propertyName: 'test-property'})
    };
    await TestBed.configureTestingModule({
      imports: [
        PropertiesComponent,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: ApiService, useValue: apiService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ propertyName: 'test' }) ,
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
     router = TestBed.inject(Router); 
    spyOn(component, 'getAllProperties');
    spyOn(component, 'getDistinctBuildingNamesOnly');
  });


  it('should go to the previous image when prevImage is called', () => {
    // Setup mock data with an array of images and a current index
    const property = {
      images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      currentImageIndex: 1
    };
    component.prevImage(property);
    
    // The current index should now be 0, since it was 1 and we moved back by one
    expect(property.currentImageIndex).toEqual(0);

    // Call prevImage again, should cycle to the last image
    component.prevImage(property);
    expect(property.currentImageIndex).toEqual(property.images.length - 1);
  });

  it('should go to the next image when nextImage is called', () => {
    // Setup mock data with an array of images and a current index
    const property = {
      images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      currentImageIndex: 1
    };

    // Call the nextImage function
    component.nextImage(property);
    
    // The current index should now be 2, since it was 1 and we moved forward by one
    expect(property.currentImageIndex).toEqual(2);

    // Call nextImage again, should cycle to the first image
    component.nextImage(property);
    expect(property.currentImageIndex).toEqual(0);
  });

    it('should return true if the cost is less than 500 and filterCriteria price is "500"', () => {
      component.filterCriteria.price = '500';
      expect(component.checkPrice(499)).toBeTrue();
      expect(component.checkPrice(500)).toBeFalse();
    });

    it('should return true if the cost is between 500 and 999 and filterCriteria price is "1000"', () => {
      component.filterCriteria.price = '1000';
      expect(component.checkPrice(500)).toBeTrue();
      expect(component.checkPrice(999)).toBeTrue();
      expect(component.checkPrice(1000)).toBeFalse();
    });

    it('should return true if the cost is between 1000 and 1499 and filterCriteria price is "1500"', () => {
      component.filterCriteria.price = '1500';
      expect(component.checkPrice(1000)).toBeTrue();
      expect(component.checkPrice(1499)).toBeTrue();
      expect(component.checkPrice(1500)).toBeFalse();
    });

    it('should return true if the cost is 1500 or more and filterCriteria price is "2000"', () => {
      component.filterCriteria.price = '2000';
      expect(component.checkPrice(1500)).toBeTrue();
      expect(component.checkPrice(2000)).toBeTrue();
    });

    it('should return true if filterCriteria price is "all"', () => {
      component.filterCriteria.price = 'all';
      expect(component.checkPrice(100)).toBeTrue();
      expect(component.checkPrice(500)).toBeTrue();
      expect(component.checkPrice(1000)).toBeTrue();
      expect(component.checkPrice(1500)).toBeTrue();
      expect(component.checkPrice(2000)).toBeTrue();
    });
  

  
  it('should create', () => {
    fixture.detectChanges(); 
    expect(component).toBeTruthy();

  });

  });

  
  
