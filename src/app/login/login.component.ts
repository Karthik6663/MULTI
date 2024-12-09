import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  otpForm!: FormGroup;
  errorMessage: string | null = null;
  otpRequired: boolean = false;
  lastLoginTime: string | null = null;
  lastLoginIP: string | null = null;
  otp: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/api/login', this.loginForm.value).subscribe(
        (response: any) => {
          if (response.otpRequired) {
            this.otpRequired = true;
            this.otp = response.otp;
          } else {
            console.log('Login successful');
            this.lastLoginTime = response.lastLoginTime;
            this.lastLoginIP = response.lastLoginIP;
            this.router.navigate(['/welcome']);
          }
        },
        error => {
          if (error.status === 403 && error.error.otpRequired) {
            this.otpRequired = true;
            this.otp = error.error.otp;
          } else {
            console.error('Error during login:', error);
            this.errorMessage = 'Invalid username or password';
          }
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  onOtpSubmit(): void {
    if (this.otpForm.valid) {
      const otp = this.otpForm.get('otp')?.value;
      if (otp === this.otp) {
        console.log('OTP verified');
        this.router.navigate(['/welcome']);
      } else {
        this.errorMessage = 'Invalid OTP';
      }
    } else {
      console.error('OTP form is invalid');
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
