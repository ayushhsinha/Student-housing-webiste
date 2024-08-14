import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from 'src/api.service';
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [ApiService] // If you use standalone components, this is correct
})
export class ContactComponent {
  contactForm = {
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    message: ''
  };

  constructor(private router: Router, private apiService: ApiService) {}

  onSubmit() {
    this.apiService.submitContactForm(this.contactForm).subscribe({
      next: (response) => {
        // Handle the response, such as showing a success message
        console.log(response);
      },
      error: (error) => {
        // Handle the error, such as showing an error message
        console.error(error);
      }
    });
  }
}
