import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgentsComponent } from './agents.component';
import { ApiService } from 'src/api.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';


describe('AgentsComponent', () => {
  let component: AgentsComponent;
  let fixture: ComponentFixture<AgentsComponent>;
  let apiServiceMock: any;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getPartnerLocations']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule, AgentsComponent],
      declarations: [],
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // Add more tests as needed to cover other functionalities and edge cases
});
