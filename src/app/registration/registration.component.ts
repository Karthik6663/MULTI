import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  constructor(private router: Router) {}
  onSubmit() {
    // Handle form submission
    console.log('Form submitted');
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
