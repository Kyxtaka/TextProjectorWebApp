import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../../../core/common/constant/role.constant';
import { AccountService } from '../../../../core/service/account/account-service';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  section: string;
  href?: string;
  badge?: string;
}

const defaultItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: 'grid', section: 'Workspace', href: '/' },
  // { id: 'projects', label: 'Projects', icon: 'folder', section: 'Workspace', href: '#projects', badge: '8' },
  { id: 'songs', label: 'Songs', icon: 'music', section: 'Workspace', href: '/songs' },
  { id: 'projector', label: 'Projector', icon: 'projector', section: 'Workspace', href: '/projector' },
  // { id: 'settings', label: 'Settings', icon: 'settings', section: 'Manage', href: '#settings' },
  // { id: 'help', label: 'Help center', icon: 'help', section: 'Manage', href: '#help' },
];

@Component({
  imports: [],
  selector: 'app-left-side-nav-bar-component',
  styleUrl: './left-side-nav-bar-component.css',
  templateUrl: './left-side-nav-bar-component.html',
})
export class LeftSideNavBarComponent {
  private readonly router = inject(Router);
  public readonly accountService = inject(AccountService);

  @Input() items: SidebarItem[] = defaultItems;
  @Input() activeItem = 'overview';
  @Output() readonly itemSelected = new EventEmitter<SidebarItem>();

  protected sections(): string[] {
    return [...new Set(this.items.map((item) => item.section))];
  }

  protected itemsForSection(section: string): SidebarItem[] {
    return this.items.filter((item) => item.section === section);
  }

  protected isActive(item: SidebarItem): boolean {
    if (item.href?.startsWith('/')) {
      return item.href === this.router.url;
    }

    return item.id === this.activeItem && !this.router.url.startsWith('/projector') && !this.router.url.startsWith('/songs');
  }

  protected selectItem(item: SidebarItem): void {
    this.itemSelected.emit(item);
    if (item.href?.startsWith('/')) {
      void this.router.navigateByUrl(item.href);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.accountService.refreshUserProfile();
    if (!this.accountService.isCurrentUserAdmin() && !this.accountService.isCurrentUserSuperAdmin()) {
      this.items = this.items.filter(item => item.id !== 'settings');
    }
    console.log("current user data in left-side-nav-bar-component:", this.accountService.userData());
    console.log('Current user permission:', this.accountService.userData()?.permission);
    if (this.accountService.isCurrentUserSuperAdmin()) {
      this.items.push({ id: 'admin', label: 'Admin Panel', icon: 'users', section: 'Manage', href: '/admin' });
    }
    // if (!this.accountService.isCurrentUserSuperAdmin()) {
    //   this.items = this.items.filter(item => item.id !== 'help');
    // }
    // if (!this.accountService.isAuthenticated()) {
    //   this.items = this.items.filter(item => item.id !== 'settings' && item.id !== 'help');
    // }
    // if (this.items.length > 0 && !this.items.some(item => item.id === this.activeItem)) {
    //   this.activeItem = this.items[0].id;
    // }
    // if (this.accountService.isCurrentUserSuperAdmin()) {
    //   this.items.push({ id: 'admin', label: 'Admin Panel', icon: 'shield', section: 'Manage', href: '/admin' });
    // }
  }

}
