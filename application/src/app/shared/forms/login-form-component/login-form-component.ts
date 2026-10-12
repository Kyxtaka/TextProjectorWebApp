import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth-service';
@Component({
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  selector: 'app-login-form-component',
  styleUrl: './login-form-component.css',
  templateUrl: './login-form-component.html',
})
export class LoginFormComponent {
  // @Output() errorMessage: string | null = null; 
  private formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public isCredentialsInvalid: WritableSignal<boolean> = signal(false);
  public isLoading: WritableSignal<boolean> = signal(false);
  constructor() { }

  public loginForm = this.formBuilder.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  public async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.isLoading.set(true);
      this.isCredentialsInvalid.set(false);
      const response = await this.authService.login(
        formData.identifier ?? '',
        formData.password ?? '',
        formData.rememberMe ?? false,
      );
      this.isLoading.set(false);
      if (response) {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/homecenter';
        await this.router.navigateByUrl(returnUrl);
        return;
      }

      this.isCredentialsInvalid.set(true);
    }
  }
} 
