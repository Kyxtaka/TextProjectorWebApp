import { HttpBackend, HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, shareReplay, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { TokenService } from '../../service/token/token-service';
import { RefreshTokenResponse } from '../api/token/apiTokenServiceDto';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly tokenService = inject(TokenService);
  private readonly rawHttp = new HttpClient(inject(HttpBackend));
  private refreshRequest$: Observable<RefreshTokenResponse> | null = null;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isAuthenticationRequest(request.url)) {
      return next.handle(request);
    }

    const token = this.tokenService.getToken();
    const shouldRefreshBeforeRequest = Boolean(token && this.tokenService.isTokenExpired(token));
    const requestWithToken = token ? this.withToken(request, token) : request;
    const request$ = shouldRefreshBeforeRequest
      ? this.refreshAccessToken().pipe(switchMap((newToken) => next.handle(this.withToken(request, newToken))))
      : next.handle(requestWithToken);

    return request$.pipe(
      catchError((error: unknown) => {
        if (!(error instanceof HttpErrorResponse) || error.status !== 401 || shouldRefreshBeforeRequest) {
          return throwError(() => error);
        }

        return this.refreshAccessToken().pipe(
          switchMap((newToken) => next.handle(this.withToken(request, newToken))),
        );
      }),
    );
  }

  private refreshAccessToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken || this.tokenService.isTokenExpired(refreshToken)) {
      this.tokenService.clearTokens();
      return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Refresh token expired' }));
    }

    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.rawHttp
        .post<RefreshTokenResponse>(`${environment.API_BASE_URL}/auth/token/refresh`, { refresh_token: refreshToken })
        .pipe(
          map((response) => {
            this.tokenService.setToken(response.access_token);
            this.tokenService.setRefreshToken(response.refresh_token);
            return response;
          }),
          catchError((error: unknown) => {
            this.tokenService.clearTokens();
            return throwError(() => error);
          }),
          finalize(() => { this.refreshRequest$ = null; }),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
    }

    return this.refreshRequest$.pipe(map((response) => response.access_token));
  }

  private withToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private isAuthenticationRequest(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/token/refresh');
  }
}