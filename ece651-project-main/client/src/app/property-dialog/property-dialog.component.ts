import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-property-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    HttpClientModule,
  ],

  providers: [ApiService],
  templateUrl: './property-dialog.component.html',
  styleUrl: './property-dialog.component.css',
})
export class PropertyDialogComponent {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<PropertyDialogComponent>,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  navigateToProfile() {
    const unitId = history.state.id;

    if (unitId) {
      this.apiService
        .get(`/rooms/unitToRoom/${unitId}`)
        .subscribe((response) => {
          const roomId = response.res[0].roomId;
          console.log('Room ID:', roomId);
          this.apiService
            .post('/bookings/create', {
              room_id: roomId,
              start_date: '2025-01-01',
              end_date: '2025-03-01',
            })
            .subscribe((response) => {
              console.log('Response:', response);

              this.router.navigate(['profile']);
            }),
            (error: any) => {
              console.error('Error:', error);
            };
        });
    }

    this.dialogRef.close();
  }
}
