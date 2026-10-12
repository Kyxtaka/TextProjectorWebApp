import { inject, Service } from '@angular/core';
import { TokenService } from '../../../service/token/token-service';
import { ApiNetwork } from '../api-network';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ApiToken } from '../token/api-token';

@Service()
export class ApiAuthService {
    private tokenService: TokenService = inject(TokenService);
    private apiTokenService: ApiToken = inject(ApiToken);
    private apiNetwork: ApiNetwork = inject(ApiNetwork); 
    private readonly API_AUTH_SERVICE_PREFIX = '/auth';
    
    public async login(email: string, password: string): Promise<{ access_token: string, refresh_token: string } | null> {
        const url = `${this.API_AUTH_SERVICE_PREFIX}/login`;
        const body = { email, password };
        try {
            return await firstValueFrom(this.apiNetwork.post<{ access_token: string, refresh_token: string }>(url, body, false));
        } catch (error) {
            console.error('Error during login:', error);
            return null;
        }
    }

    public async logout(): Promise<void> { 
        try {
            const token = this.tokenService.getToken();
            if (token) {
                const payload = this.tokenService.getTokenPayload(token);
                await this.apiTokenService.apiRevokeTokenByJti(payload?.jti || '');
            }
        }
        catch (error) {
            console.error('Error during logout:', error);
        }
    }

    // User profile to define
    /**
     * Fetches the user's profile.
     * 
     * @returns {
        "uuid": "d035ab43-91a0-11f1-87e7-bebe360301fa",
        "id": 3,
        "username": "Hikarizsu",
        "email": "randriantsoanathan1@gmail.com",
        "permission": "SUPER_ADMIN",
        "createdAt": "2026-08-04T05:57:59.235Z",
        "updatedAt": "2026-08-06T12:12:08.919Z"
    }
     */
    public async getUserProfile(): Promise <any | null> {
        const url = `${this.API_AUTH_SERVICE_PREFIX}/profile`;
        try {
            return await firstValueFrom(this.apiNetwork.get<any>(url, true));
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

}
