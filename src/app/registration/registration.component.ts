import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z]).+$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@.+\\.com$')]],
      phone: ['', [Validators.required, Validators.pattern('^\\+[1-9]{1}[0-9]{3,14}$')]],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      authType: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.registrationService.registerUser(this.registrationForm.value).subscribe(
        response => {
          console.log('User registered successfully');
          this.successMessage = 'Registration successful! Redirecting to login page...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); // Redirect after 3 seconds
        },
        error => {
          console.error('Error registering user:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
