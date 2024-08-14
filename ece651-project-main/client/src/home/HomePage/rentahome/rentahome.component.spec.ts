import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentHomeComponent} from './rentahome.component';

describe('RentHomeComponent', () => {
  let component: RentHomeComponent;
  let fixture: ComponentFixture<RentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
