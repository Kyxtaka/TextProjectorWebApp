import { inject, Service } from '@angular/core';
import { TokenService } from '../../../service/token/token-service';
import { ApiNetwork } from '../api-network';
import { RefreshTokenRequest, RefreshTokenResponse, TokenPayload } from './apiTokenServiceDto';
import { environment } from '../../../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
@Service()
export class ApiToken {
    private tokenService: TokenService = inject(TokenService);
    private apiNetwork: ApiNetwork = inject(ApiNetwork);
    private readonly API_TOKEN_SERVICE_PREFIX = '/auth'

    public async apiRefreshToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
        const url = `${this.API_TOKEN_SERVICE_PREFIX}/token/refresh`;
        const body: RefreshTokenRequest = { refresh_token: refreshToken };
        try {
            return await firstValueFrom(this.apiNetwork.post<RefreshTokenResponse>(url, body, false));
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }
    
    public async apiIsTokenValidByAPI(token: string): Promise<boolean> {
        if (this.tokenService.isTokenExpired(token)) {
            return false;
        }
        if (!await this.apiGetTokenPayload()) {
            return false;
        }
        return true;
    }
    
    public async apiRevokeTokenByJti(jti: string): Promise<void> {
        const url = `${this.API_TOKEN_SERVICE_PREFIX}/token/revoke/${jti}`;
        try {
            await firstValueFrom(this.apiNetwork.get<void>(url, true));
        } catch (error) {
            console.error('Error revoking token:', error);
        }
    }

    public async apiGetTokenPayload(): Promise<TokenPayload | null> {
        const url = `${this.API_TOKEN_SERVICE_PREFIX}/token/payload`;
        try {
            return await firstValueFrom(this.apiNetwork.get<TokenPayload>(url, true));
        } catch (error) {
            console.error('Error fetching token payload:', error);
            return null;
        }
    }



    // public  async apiGetTokenPayload(): TokenPayload | null {
    //     const url = `${this.API_TOKEN_SERVICE_PREFIX}/token/payload`;
    //     try {
    //         return await this.apiNetwork.get<TokenPayload>(url, true).subscribe({
    //             next: (payload) => {
    //                 return payload;
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching token payload:', error);
    //                 return null;
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error fetching token payload:', error);
    //         return null;
    //     }
    // }

}
