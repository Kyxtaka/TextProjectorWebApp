import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../../../../shared/forms/login-form-component/login-form-component';
import { RouterLink } from '@angular/router';
@Component({
  imports: [CommonModule, LoginFormComponent, RouterLink],
  selector: 'app-identifier-login-page-component',
  styleUrl: './identifier-login-page-component.css',
  templateUrl: './identifier-login-page-component.html',
})
export class IdentifierLoginPageComponent {}
