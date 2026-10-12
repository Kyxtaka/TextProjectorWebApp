import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/service/auth/auth-service';
import { HeaderNavBarComponent } from './shared/navigationBar/header/header-nav-bar-component/header-nav-bar-component';
import { LeftSideNavBarComponent } from './shared/navigationBar/side/left-side-nav-bar-component/left-side-nav-bar-component';

@Component({
  imports: [RouterOutlet, HeaderNavBarComponent, LeftSideNavBarComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly authService = inject(AuthService);
  protected readonly title = signal('application');
  protected readonly sidebarOpen = signal(true);

  constructor() {
    this.authService.startSessionMonitor();
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((isOpen) => !isOpen);
  }
}
