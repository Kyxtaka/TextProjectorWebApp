import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BackgroundProjectionEvent,
  ProjectionTextStyle,
  TextProjectionEvent,
} from '../../model/projection-event';
import { ProjectionEventService } from '../../service/projection-event.service';

@Component({
  imports: [CommonModule],
  selector: 'app-projection-page',
  styleUrl: './projection-page.css',
  templateUrl: './projection-page.html',
})
export class ProjectionPageComponent {
  private readonly eventService = inject(ProjectionEventService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly text = signal('En attente de texte');
  protected readonly textStyle = signal<ProjectionTextStyle>({});
  protected readonly background = signal<ProjectionBackgroundStyle>({
    color: '#10131a',
    image: null,
  });
  protected readonly transition = signal('fade 500ms ease');
  protected readonly targetLabel = this.eventService.getTargetLabel();

  constructor() {
    document.title = `Projection - ${this.targetLabel}`;
    this.eventService.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.apply(event));
  }

  private apply(event: TextProjectionEvent | BackgroundProjectionEvent): void {
    if (event.type === 'text') {
      this.textStyle.set(event.style);
      this.text.set(event.text);
      return;
    }

    const background = event.background;
    this.background.set(background.type === 'color'
      ? { color: background.value, image: null }
      : { color: '#10131a', image: `url("${background.value}")` });
    this.transition.set(`${event.nextTextTransition.effect} ${event.nextTextTransition.durationMs}ms ease`);
  }
}

interface ProjectionBackgroundStyle {
  color: string;
  image: string | null;
}