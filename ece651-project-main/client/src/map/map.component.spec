import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { MapComponent } from './map.component';
import { of, throwError } from 'rxjs';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [MapComponent, HttpClientTestingModule],
      providers: [ApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);

    // Mocking the map related functions since they are not the focus of this test
    // window['L'] = {
    //   map: () => ({
    //     setView: () => {},
    //     on: () => {},
    //   }),
    //   tileLayer: () => ({
    //     addTo: () => {},
    //   }),
    //   marker: () => ({
    //     addTo: () => ({ bindPopup: () => {}, on: () => {} }),
    //   }),
    //   circle: () => ({
    //     addTo: () => ({ bindPopup: () => {}, on: () => {} }),
    //   }),
    // };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchDataAndRenderMap', () => {
      spyOn(component, 'fetchDataAndRenderMap');
      component.ngOnInit();
      expect(component.fetchDataAndRenderMap).toHaveBeenCalled();
    });
  });

  it('should get latitude, longitude and property name', () => {
    expect(component.getLatitudes).toHaveBeenCalled();
    expect(component.getLongitudes).toHaveBeenCalled();
    expect(component.getPropertyNames).toHaveBeenCalled();
  });

  describe('fetchDataAndRenderMap', () => {
    it('should call apiService.get and render map on success', () => {
      const mockData = [{ property_name: 'Test', latitude: '0', longitude: '0' }];
      spyOn(apiService, 'get').and.returnValue(of(mockData));
      spyOn(component, 'renderMap');

      component.fetchDataAndRenderMap();

      expect(apiService.get).toHaveBeenCalled();
      expect(component.renderMap).toHaveBeenCalledWith(['0'], ['0'], ['Test']);
    });

    it('should log error on failure', () => {
      spyOn(apiService, 'get').and.returnValue(throwError(() => new Error('Test Error')));
      spyOn(console, 'error');

      component.fetchDataAndRenderMap();

      expect(apiService.get).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error:', jasmine.any(Error));
    });
  });

  // Add more tests here for other methods like renderMap, addMarkerToMap, etc.

});

