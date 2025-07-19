import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  confirmationForm: FormGroup;
  loading = false;
  error = '';
  showConfirmation = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    
    this.confirmationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  async onSignUp() {
    if (this.signupForm.valid) {
      this.loading = true;
      this.error = '';
      
      try {
        const { email, password } = this.signupForm.value;
        this.email = email;
        await this.authService.signUp(email, password);
        this.showConfirmation = true;
      } catch (error: any) {
        this.error = error.message || 'Sign up failed';
      }
      
      this.loading = false;
    }
  }

  async onConfirm() {
    if (this.confirmationForm.valid) {
      this.loading = true;
      this.error = '';
      
      try {
        const { code } = this.confirmationForm.value;
        await this.authService.confirmSignUp(this.email, code);
        await this.authService.signIn(this.signupForm.value.email, this.signupForm.value.password);
      } catch (error: any) {
        this.error = error.message || 'Confirmation failed';
      }
      
      this.loading = false;
    }
  }

  async resendCode() {
    this.loading = true;
    this.error = '';
    
    try {
      await this.authService.resendConfirmationCode(this.email);
    } catch (error: any) {
      this.error = error.message || 'Failed to resend code';
    }
    
    this.loading = false;
  }
}
