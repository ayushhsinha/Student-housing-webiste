import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellHomeComponent } from './sellahome.component';

describe('SellHomeComponent ', () => {
  let component: SellHomeComponent ;
  let fixture: ComponentFixture<SellHomeComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellHomeComponent ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellHomeComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
