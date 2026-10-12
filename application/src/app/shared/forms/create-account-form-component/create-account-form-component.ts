import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-create-account-form-component',
  styleUrl: './create-account-form-component.css',
  templateUrl: './create-account-form-component.html',
})
export class CreateAccountFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly submitted = signal(false);

  protected readonly accountForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  protected submit(): void {
    if (this.accountForm.invalid || this.accountForm.value.password !== this.accountForm.value.confirmPassword) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.submitted.set(true);
  }

  protected passwordsDoNotMatch(): boolean {
    const form = this.accountForm;
    return form.get('confirmPassword')?.touched === true && form.value.password !== form.value.confirmPassword;
  }
}
