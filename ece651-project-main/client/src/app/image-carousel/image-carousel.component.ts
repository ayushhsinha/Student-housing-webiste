import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { ApiService } from '../api.service';
// import { API_ENDPOINTS } from '../api.constants';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from 'src/dialog/dialog.component';
import { AuthService } from 'src/auth.service';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ApiService } from 'src/api.service';
import { HeaderComponent } from 'src/home/HomePage/header/header.component';
import { FooterModule } from 'src/home/HomePage/footer/footer.module';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { BookingConfirmationDialogComponent } from '../booking-confirmation-dialog/booking-confirmation-dialog.component';

interface Unit {
  number: string; // or number if you use numerical identifiers
  available: boolean;
  // Add any other properties for the unit here if needed
}
interface Feature {
  name: string;
  icon: string;
}
interface Room {
  price: any;
  // cost: number;
  bedrooms: number;
  bathrooms: number;
  features: Feature[];
  // features: { name: string; icon?: string }[];
}

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    HeaderComponent,
    FooterModule,
  ],

  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.css',
  providers: [ApiService],
})
export class ImageCarouselComponent implements OnInit {
  units: Unit[];
  item: any;
  // rooms: Room[]=[];// The array of units for the availability section
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {
    this.units = [
      { number: '1', available: true },
      { number: '2', available: true },
      { number: '3', available: true },
      { number: '4', available: false },
      { number: '5', available: false },
      // ... more units
    ];
  }
  mainImage: string = ''; // Default to empty or a placeholder image
  middleimage: string[] = [];
  sideImages: string[] = [];

  // mainImage = 'assets/roompic.png'; // replace with the path to your main image
  // sideImages = [
  //   'assets/roompic.png',
  //   'assets/roompic.png',
  // ];
  // middleimage=['assets/roompic.png',
  // 'assets/roompic.png',];
  //  price = 'USD 1,200';
  // bedrooms = 1;
  // bathrooms = 1;
  features = [
    { name: 'Elevator', icon: 'elevator' },
    { name: 'Laundry Facilities', icon: 'local_laundry_service' },
    { name: 'Utilities', icon: 'bolt' },
    { name: 'Fire Place', icon: 'fireplace' },
    { name: 'Balcony', icon: 'deck' },
    { name: 'Garden', icon: 'grass' },
  ];
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.queryParamMap.get('name');
    const price = this.route.snapshot.queryParamMap.get('price');
    console.log('Room ID:', id);
    console.log('Name:', name);
    console.log('Price:', price);
    if (id) {
      this.getRoomDetails(id);
      this.fetchRoomImages(id);
    } else {
      console.error('roomId not found in url');
    }
  }

  fetchRoomImages(id: string) {
    const endpoint = `/picture/${id}`;
    this.apiService.get(endpoint).subscribe((imageData: any) => {
      console.log('ImageData:', imageData);
      if (imageData && imageData.pic && imageData.pic.length > 0) {
        // Assign image URLs to component properties
        this.mainImage = imageData.pic[0]; // First image as main image
        this.middleimage = imageData.pic.slice(1, 3); // Next two images for the middle
        this.sideImages = imageData.pic.slice(3, 5); // Rest for the side
      }
    });
  }

  rooms: any = [];

  getRoomDetails(id: string) {
    const endpoint = `/rooms/${id}`;
    console.log('Form Status:');

    this.apiService.get(endpoint).subscribe(
      (data: any) => {
        console.log('Fo2322rm Status:');
        console.log('Data:', data);

        // this.rooms= data.res.map((item: { price: any; beds:any ; bathrooms:any;})=>({

        // price : item.price,
        // beds : item.beds,

        // bathrooms : item.bathrooms,
        if (data && data.res && data.res.length > 0) {
          const item = data.res[0]; // Assuming you're only interested in the first item
          this.rooms = [
            {
              price: item.price,
              beds: item.beds,
              bathrooms: item.bathrooms,
              features: this.extractFeatures(item),
            },
          ];

          console.log('Form Status:', this.rooms);
        }
      },
      (error) => {
        console.error('Error fetching properties', error);
      }
    );
  }
  // console.log('Form Status:', this.rooms);
  private featureIcons: { [key: string]: Feature } = {
    kitchen_utilities: { name: 'Kitchen Utilities', icon: 'kitchen' },
    internet: { name: 'Internet', icon: 'wifi' },
    parking: { name: 'Parking', icon: 'local_parking' },
    laundary_facilities: {
      name: 'Laundry Facilities',
      icon: 'local_laundry_service',
    },
    train: { name: 'Train Access', icon: 'train' },
    garden: { name: 'garden', icon: 'local_florist' },
    study_room: { name: 'study_room', icon: 'local_library' },
    furnishings: { name: 'furnishings', icon: 'weekend' },
    // Add other mappings as necessary
  };
  private extractFeatures(item: any): Feature[] {
    return Object.keys(this.featureIcons).reduce((features, key) => {
      if (item[key]) {
        // If the feature exists and is not null
        const { name, icon } = this.featureIcons[key];
        features.push({ name, icon });
      }
      return features;
    }, [] as Feature[]);
  }
  openEnquiryDialog() {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: '90%', // Adjust the size as necessary

      // data: { anyData: 'You might want to pass' } // Optional: if you want to pass data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed
    });
  }
  goToBooking(unit: Unit) {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.queryParamMap.get('name');
    const price = this.route.snapshot.queryParamMap.get('price');

    this.router.navigate(['bookings'], {
      state: { id, name, price },
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(BookingConfirmationDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with the action
      } else {
        // User clicked 'No' or closed the dialog, handle accordingly
      }
    });
  }
  // navigateToNextPage() {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   const name = this.route.snapshot.queryParamMap.get('name');
  //   const price = this.route.snapshot.queryParamMap.get('price');

  //   this.router.navigate(['/booking/'], {
  //     state: { id, name, price }
  //   });
  // }
}
