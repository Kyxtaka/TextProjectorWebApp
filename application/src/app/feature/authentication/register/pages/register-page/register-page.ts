import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreateAccountFormComponent } from '../../../../../shared/forms/create-account-form-component/create-account-form-component';

@Component({
  imports: [RouterLink, CreateAccountFormComponent],
  selector: 'app-register-page',
  styleUrl: './register-page.css',
  templateUrl: './register-page.html',
})
export class RegisterPage {}
