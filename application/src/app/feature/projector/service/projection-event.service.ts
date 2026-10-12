import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  BackgroundProjectionEvent,
  ProjectionBackground,
  ProjectionEvent,
  ProjectionTextStyle,
  ProjectionTextTransition,
  TextProjectionEvent,
} from '../model/projection-event';

@Injectable({ providedIn: 'root' })
export class ProjectionEventService {
  private readonly eventSubject = new Subject<ProjectionEvent>();
  readonly clientId = this.getOrCreateClientId();
  private readonly channelClientId = this.getChannelClientId();
  private channel: BroadcastChannel | null = null;
  private allScreensChannel: BroadcastChannel | null = null;
  private targetId = this.getQueryParameter('projection') || 'main';
  private broadcastToAllScreens = false;

  readonly events$ = this.eventSubject.asObservable();

  constructor() {
    this.openChannel();
  }

  setTarget(targetId: string): void {
    if (!targetId || targetId === this.targetId) {
      return;
    }

    this.channel?.close();
    this.allScreensChannel?.close();
    this.targetId = targetId;
    this.openChannel();
  }

  getTargetId(): string {
    return this.targetId;
  }

  getProjectionUrl(targetId = this.targetId, targetName = targetId): string {
    const query = new URLSearchParams({
      client: this.clientId,
      projection: targetId,
      label: targetName,
    });
    return `/projection?${query.toString()}`;
  }

  setBroadcastToAllScreens(enabled: boolean): void {
    this.broadcastToAllScreens = enabled;
  }

  publish(event: ProjectionEvent): void {
    this.eventSubject.next(event);
    if (this.broadcastToAllScreens) {
      this.allScreensChannel?.postMessage(event);
      return;
    }

    this.channel?.postMessage(event);
  }

  publishText(text: string, style: ProjectionTextStyle = {}): void {
    this.publish(new TextProjectionEvent(text, style));
  }

  publishBackground(
    background: ProjectionBackground,
    nextTextTransition?: ProjectionTextTransition,
  ): void {
    this.publish(new BackgroundProjectionEvent(background, nextTextTransition));
  }

  private fromMessage(event: ProjectionEvent): ProjectionEvent {
    if (event.type === 'text') {
      return new TextProjectionEvent(event.text, event.style);
    }

    return new BackgroundProjectionEvent(event.background, event.nextTextTransition);
  }

  private openChannel(): void {
    if (typeof BroadcastChannel === 'undefined') {
      return;
    }

    this.channel = new BroadcastChannel(`text-projector-events:${this.channelClientId}:${this.targetId}`);
    this.allScreensChannel = new BroadcastChannel(`text-projector-events:${this.channelClientId}:all`);
    this.channel.addEventListener('message', (message: MessageEvent<ProjectionEvent>) => {
      this.eventSubject.next(this.fromMessage(message.data));
    });
    this.allScreensChannel.addEventListener('message', (message: MessageEvent<ProjectionEvent>) => {
      this.eventSubject.next(this.fromMessage(message.data));
    });
  }

  private getChannelClientId(): string {
    return this.getQueryParameter('client') || this.clientId;
  }

  getTargetLabel(): string {
    return this.getQueryParameter('label') || this.targetId;
  }

  private getQueryParameter(name: string): string | null {
    return typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get(name);
  }

  private getOrCreateClientId(): string {
    if (typeof window === 'undefined') {
      return 'server';
    }

    const storageKey = 'text-projector-client-id';
    const currentId = window.localStorage.getItem(storageKey);
    if (currentId) {
      return currentId;
    }

    const newId = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(storageKey, newId);
    return newId;
  }
}