import { Injectable, inject } from '@angular/core';
import { TokenService } from '../token/token-service';
import { ApiAuthService } from '../../network/api/auth/api-auth-service';
import { ApiToken } from '../../network/api/token/api-token';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenService: TokenService = inject(TokenService);
    private readonly apiAuthService =  inject(ApiAuthService); 
    private readonly apiTokenService = inject(ApiToken);
    private readonly router = inject(Router);
    private monitorStarted = false;

    public async login(email: string, password: string, rememberMe = true): Promise<{ access_token: string, refresh_token: string } | null> {
        const response = await this.apiAuthService.login(email, password);
        if (response) {
            this.tokenService.setToken(response.access_token, rememberMe);
            this.tokenService.setRefreshToken(response.refresh_token, rememberMe);
            return response;
        }
        return null;
    }

    public async logout(): Promise<void> {
        await this.apiAuthService.logout();
        this.tokenService.clearTokens();
    }

    public isAuthenticated(): boolean {
        const token = this.tokenService.getToken();
        return token !== null && !this.tokenService.isTokenExpired(token);
    }

    public async ensureAuthenticated(): Promise<boolean> {
        const accessToken = this.tokenService.getToken();
        if (accessToken && !this.tokenService.isTokenExpired(accessToken)) {
            return true;
        }

        const refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken || this.tokenService.isTokenExpired(refreshToken)) {
            this.tokenService.clearTokens();
            return false;
        }

        const response = await this.apiTokenService.apiRefreshToken(refreshToken);
        if (!response) {
            this.tokenService.clearTokens();
            return false;
        }

        this.tokenService.setToken(response.access_token);
        this.tokenService.setRefreshToken(response.refresh_token);
        return true;
    }

    public startSessionMonitor(): void {
        if (this.monitorStarted || typeof window === 'undefined') {
            return;
        }

        this.monitorStarted = true;
        window.setInterval(async () => {
            if (!this.tokenService.hasToken() && !this.tokenService.hasRefreshToken()) {
                return;
            }

            const authenticated = await this.ensureAuthenticated();
            if (!authenticated && this.router.url !== '/login') {
                await this.router.navigate(['/login']);
            }
        }, 3 * 60 * 1000);
    }
}