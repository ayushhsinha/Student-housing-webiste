import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyDialogComponent } from './property-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
class ActivatedRouteMock {}

// Mock MatDialogRef
class MatDialogRefMock {
  close(): void {}
}

describe('PropertyDialogComponent', () => {
  let component: PropertyDialogComponent;
  let fixture: ComponentFixture<PropertyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: MatDialogRef, ActivatedRoute, useClass: MatDialogRefMock, }, 
        { provide: MAT_DIALOG_DATA, useValue: {} } ,
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(PropertyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
