import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Import RouterTestingModule here
      declarations: [FooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home', () => {
    const navigateSpy = spyOn(component['router'], 'navigate'); // Spy on router navigate method
    component.navigateTo('/home');
    expect(navigateSpy).toHaveBeenCalledWith(['/home']); // Check if router navigate method was called with correct route
  });

  it('should navigate to /properties', () => {
    const navigateSpy = spyOn(component['router'], 'navigate'); // Spy on router navigate method
    component.navigateTo('/properties');
    expect(navigateSpy).toHaveBeenCalledWith(['/properties']); // Check if router navigate method was called with correct route
  });

  // Add more test cases for other routes as needed
});
