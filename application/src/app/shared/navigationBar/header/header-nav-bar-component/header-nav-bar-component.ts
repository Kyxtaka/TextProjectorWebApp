import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AccountService } from '../../../../core/service/account/account-service';

export interface HeaderAction {
  id: string;
  label: string;
}

export interface HeaderNavBarComponentTile {
  loginRequired: boolean;
  title: string;
  redirectUrl: string;
}

@Component({
  imports: [CommonModule],
  selector: 'app-header-nav-bar-component',
  styleUrl: './header-nav-bar-component.css',
  templateUrl: './header-nav-bar-component.html',
})
export class HeaderNavBarComponent {
  @Input() breadcrumb = 'Overview';
  @Input() searchPlaceholder = 'Search anything...';
  @Input() actions: HeaderAction[] = [];

  @Output() readonly sidebarToggle = new EventEmitter<void>();
  @Output() readonly actionSelected = new EventEmitter<string>();

  protected accountService = inject(AccountService);

}
