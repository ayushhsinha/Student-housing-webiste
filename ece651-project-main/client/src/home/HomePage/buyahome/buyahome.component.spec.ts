import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyHomeComponent } from './buyahome.component';

describe('BuyahomeComponent', () => {
  let component: BuyHomeComponent;
  let fixture: ComponentFixture<BuyHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
