import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SliderComponent } from './slider.component';

// A mock Router class with a navigate method
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;
  let mockRouter: MockRouter;

  beforeEach(waitForAsync(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [],
      imports: [SliderComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct initial project selected', () => {
    expect(component.currentProjectIndex).toBe(0);
    expect(component.currentProjectName).toBe('Justina Mountains');
  });

  it('should go to the next project', () => {
    component.nextProject();
    expect(component.currentProjectIndex).toBe(1);
    expect(component.currentProjectName).toBe('Nitzsche Loaf');
  });

  it('should not go past the last project', () => {
    // Set to last project
    component.currentProjectIndex = component.projects.length - 1;
    component.nextProject();
    expect(component.currentProjectIndex).toBe(component.projects.length - 1);
  });

  it('should go to the previous project', () => {
    // Set to second project
    component.currentProjectIndex = 1;
    component.prevProject();
    expect(component.currentProjectIndex).toBe(0);
    expect(component.currentProjectName).toBe('Justina Mountains');
  });

  it('should not go before the first project', () => {
    // Set to first project
    component.currentProjectIndex = 0;
    component.prevProject();
    expect(component.currentProjectIndex).toBe(0);
  });

  it('should navigate to the correct project detail view', () => {
    const expectedRoute = ['/properties', component.projects[0].id];
    component.viewProject();
    expect(mockRouter.navigate).toHaveBeenCalledWith(expectedRoute);
  });
});
