import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';
import { Property } from './property.model';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/home/HomePage/header/header.component';
import { FooterModule } from 'src/home/HomePage/footer/footer.module';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselModule } from './carousel/carousel.module';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [HttpClientModule, CommonModule, HeaderComponent, FooterModule, FormsModule, CarouselModule],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css'],
  providers: [ApiService]
})
export class PropertiesComponent implements OnInit {
//  properties: Property[] = [];
filterCriteria = {
  price: 'all',
  bedrooms: 'all',
  bathrooms: 'all',
  location: 'all'
};
filteredProperties: any[] = [];
showFiltered: boolean = false;

constructor( private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

ngOnInit(): void {


 this.route.params.subscribe(params => {
  const propertyName = params['propertyName'];
  if (propertyName) {
    this.filterCriteria.location = decodeURIComponent(propertyName);
  }
  this.getAllProperties();
  this.getDistinctBuildingNamesOnly();
});


}
properties:any=[];
getAllProperties() {
  this.apiService.get('/search/properties').subscribe(
    (data: any) => {
      console.log("data",data);
      this.properties = data.data.map((property: { images: any; cost: any; bedrooms: any; bathrooms: any; listingName: any, unitId: any }) => ({
        images: property.images,
        cost: property.cost,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        currentImageIndex: 0,
        listingName: property.listingName,
        unitId: property.unitId

      }));
      console.log("propertyu",this.properties.data[0].listingName)

      if (this.filterCriteria.location !== 'all') {
        this.filteredProperties = this.properties.filter((property: any) => 
          property.listingName.includes(this.filterCriteria.location)
        );
        this.showFiltered = true;
      } else {
        this.filteredProperties = [...this.properties];
        this.showFiltered = false;
      }
    },
    
    
    error => {
      console.error('Error fetching properties', error);
    }
  );
 
}


prevImage(property: any) {
  property.currentImageIndex = (property.currentImageIndex - 1 + property.images.length) % property.images.length;
}

// Function to handle clicking on the right arrow
nextImage(property: any) {
  property.currentImageIndex = (property.currentImageIndex + 1) % property.images.length;
}
// getAllProperties() {
//   this.apiService.getAllProperties().subscribe(
//     (data: any) => { // Accept any type of data
//       this.properties = data;
//     },
//     error => {
//       console.error('Error fetching partner locations', error);
//     }
//   );
// }
distinctBuildingNames: string[] = []; // Add this to your class properties

getDistinctBuildingNamesOnly() {
  this.apiService.get('/search/properties').subscribe(
    (data: any) => {
      // Extract the listing names and convert to Set to get unique values
      const listingNames = data.data.map((property: any) => property.listingName);
      const buildingNamesSet = new Set<string>();

      listingNames.forEach((listingName: string) => {
        if (typeof listingName === 'string') { // Make sure listingName is a string
          const buildingName = listingName.split(' at ')[1]; // Assumes format is "Apt XXX at BuildingName"
          if (buildingName) {
            buildingNamesSet.add(buildingName.trim()); // Add unique building names to the Set
          }
        }
      });

      // Convert the set to an array and slice to get only the first 6 distinct names
      this.distinctBuildingNames = Array.from(buildingNamesSet).slice(0, 6);
      console.log("Distinct Building Names", this.distinctBuildingNames);
    },
    error => {
      console.error('Error fetching distinct building names', error);
    }
  );
}


 navigateToRooms(property:any) {
  console.log(property)
  let navigationExtras: NavigationExtras = {
    queryParams: {
      name: property.listingName,
      price: property.cost
    }
  };
  console.log("dsada",navigationExtras)

  this.router.navigate(['/rooms', property.unitId], navigationExtras); 
 }


applyFilters() {
  if (this.filterCriteria.location !== 'all') {
    // If location filter is set from URL, filter only by location.
    this.filteredProperties = this.properties.filter((property: any) => 
      property.listingName.includes(this.filterCriteria.location)
    ); }
  // Filter the properties based on the criteria.
  const results = this.properties.filter((property: any) => {
    const parsedCost = Number(property.cost); 
    const parsedBedrooms = Number(property.bedrooms);
    const parsedBathrooms = Number(property.bathrooms);
    const filterBedrooms = this.filterCriteria.bedrooms !== 'all' ? Number(this.filterCriteria.bedrooms) : 'all';
    const filterBathrooms = this.filterCriteria.bathrooms !== 'all' ? Number(this.filterCriteria.bathrooms) : 'all';
    console.log(`Property: ${property.listingName}, Bedrooms: ${parsedBedrooms}, Filter: ${filterBedrooms}, Bathrooms: ${parsedBathrooms}, Filter: ${filterBathrooms}`);

    return (this.filterCriteria.price === 'all' || this.checkPrice(parsedCost)) &&
           (filterBedrooms === 'all' || parsedBedrooms === filterBedrooms) &&
           (filterBathrooms === 'all' || parsedBathrooms === filterBathrooms) &&
           (this.filterCriteria.location === 'all' || property.listingName.includes(this.filterCriteria.location));
  });

  if (results.length > 0) {
    this.filteredProperties = results;
    this.showFiltered = true;
  } else {
    this.filteredProperties = []; // Might want to clear out old results
    this.showFiltered = false;
  }

  console.log('Filtered Properties:', this.filteredProperties.length > 0 ? this.filteredProperties : 'No properties match the filter criteria.');
}


resetFilters() {
  this.filterCriteria = {
    price: 'all',
    bedrooms: 'all',
    bathrooms: 'all',
    location: 'all'
  };
  
  // Reset filtered properties list
  this.filteredProperties = [];

  // Set showFiltered to false to show all properties
  this.showFiltered = false;

  // Fetch all properties again if needed
  this.getAllProperties();
}

checkPrice(cost: number) {
  switch (this.filterCriteria.price) {
    case '500':
      return cost < 500;
    case '1000':
      return cost >= 500 && cost < 1000;
    case '1500':
      return cost >= 1000 && cost < 1500;
    case '2000':
      return cost >= 1500;
    default:
      return true; 
  }
}

  
}
