export type ProjectionTextStyle = Record<string, string>;

export type ProjectionBackground =
  | { type: 'color'; value: string }
  | { type: 'image'; value: string };

export interface ProjectionTextTransition {
  effect: 'none' | 'fade' | 'slide';
  durationMs: number;
}

export class TextProjectionEvent {
  readonly type = 'text' as const;

  constructor(
    readonly text: string,
    readonly style: ProjectionTextStyle = {},
  ) {}
}

export class BackgroundProjectionEvent {
  readonly type = 'background' as const;

  constructor(
    readonly background: ProjectionBackground,
    readonly nextTextTransition: ProjectionTextTransition = {
      effect: 'fade',
      durationMs: 500,
    },
  ) {}
}

export type ProjectionEvent = TextProjectionEvent | BackgroundProjectionEvent;