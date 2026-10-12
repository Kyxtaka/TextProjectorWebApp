import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-welcome-page',
  styleUrl: './welcome-page.css',
  templateUrl: './welcome-page.html',
})
export class WelcomePageComponent {
  protected openProjection(): void {
    window.open('/projection', 'text-projector-projection', 'popup,width=1280,height=720');
  }
}
