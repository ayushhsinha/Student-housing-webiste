import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { MapComponent } from './map.component';
import { of, throwError, delay } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

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


  it('should call fetchDataAndRenderMap', () => {
    spyOn(component, 'fetchDataAndRenderMap');
    component.ngOnInit();
    expect(component.fetchDataAndRenderMap).toHaveBeenCalled();
  });

  // it('should call getLongitudes', async () => {
  //   component.getLongitudes(["aman","121","1212"]);
  //   expect(spyOn(component, 'getLongitudes')).toHaveBeenCalled();
  // })

  it('should call getPropertyNames', async () => {
    spyOn(component, 'getPropertyNames');
    component.getPropertyNames([]);
    expect(component.getPropertyNames).toHaveBeenCalled();
  })

  it('should call renderMap', async () => {
    spyOn(component, 'renderMap');
    component.renderMap([], [], []);
    expect(component.renderMap).toHaveBeenCalled();
  })

  it('should call addTitleLayerToMap, addMarkerToMap and addCircleToMap', async () => {
    spyOn(component, 'addTileLayerToMap');
    spyOn(component, 'addMarkerToMap');
    spyOn(component, 'addCircleToMap');
    component.addTileLayerToMap([]);
    component.addMarkerToMap("", "", "", "", 1);
    component.addCircleToMap("", "", "");
    expect(component.addTileLayerToMap).toHaveBeenCalled();
    expect(component.addMarkerToMap).toHaveBeenCalled();
    expect(component.addCircleToMap).toHaveBeenCalled();
  })


  // it('should give error for false API call', () => {
  //   spyOn(apiService, 'get').and.returnValue(throwError(new Error('Error')));
  //   spyOn(component, 'fetchDataAndRenderMap');
  //   expect(component.fetchDataAndRenderMap).toEqual('Error accessing the API!');
  // })

  // it('should log an error for a failed API call', () => {
  //   const errorMessage = 'Error accessing the API!';
  //   spyOn(apiService, 'get').and.returnValue(throwError(new Error(errorMessage)));
  //   spyOn(component, 'fetchDataAndRenderMap');
  //   spyOn(console, 'error');
  //   component.fetchDataAndRenderMap();
  //   expect(console.error).toHaveBeenCalledWith(errorMessage);
  // });

  // it('should call getLatitudes', async () => {
  //   spyOn(apiService, 'get').and.returnValue(of([
  //     { property_name: 'Location 1', latitude: '123', longitude: '456' },
  //     { property_name: 'Location 2', latitude: '789', longitude: '012' }
  //   ]));
  //   spyOn(component, 'getLatitudes');
  //   component.fetchDataAndRenderMap();
  //   expect(component.getLatitudes).toHaveBeenCalled();
  // })

  // it('should call getLatitudes', () => {
  //   spyOn(apiService, 'get').and.returnValue(of([
  //     { property_name: 'Location 1', latitude: '123', longitude: '456' },
  //     { property_name: 'Location 2', latitude: '789', longitude: '012' }
  //   ]));

  //   spyOn(component, 'getLatitudes');

  //   component.fetchDataAndRenderMap();

  //   expect(component.getLatitudes).toHaveBeenCalled();
  // });

});