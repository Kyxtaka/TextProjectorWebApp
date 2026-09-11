import { Service, inject } from '@angular/core';
import { TokenService } from '../token/token-service';
import { ApiAuthService } from '../../network/api/auth/api-auth-service';

@Service()
export class AuthService {
    private tokenService: TokenService = inject(TokenService);
    private readonly apiAuthService =  inject(ApiAuthService); 

    public async login(email: string, password: string): Promise<{ access_token: string, refresh_token: string } | null> {
        const response = await this.apiAuthService.login(email, password);
        if (response) {
            this.tokenService.setToken(response.access_token);
            this.tokenService.setRefreshToken(response.refresh_token);
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
        const refreshToken = this.tokenService.getRefreshToken();
        return token !== null && !this.tokenService.isTokenExpired(token);
    }
}