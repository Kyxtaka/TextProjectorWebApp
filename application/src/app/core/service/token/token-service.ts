import { Service, inject } from '@angular/core';
import { CookieService, CookieOptions } from 'ngx-cookie-service';
import { ApiConstant } from '../../network/api/constant/constant';
import { jwtDecode, JwtPayload } from 'jwt-decode';


@Service()
export class TokenService {
    private cookieService: CookieService = inject(CookieService);
    private secureCookieOptions: CookieOptions = {
        expires: new Date(new Date().setDate(new Date().getDate() + 7)),
        path: '/', 
        domain: window.location.hostname, 
        sameSite: 'Strict', 
        secure: true
    };

    constructor() {}

    /**
     * Sets the access token in a secure cookie 
     * @param token string
     */
    public setToken(token: string): void {
        this.cookieService.set(ApiConstant.TOKEN_KEY, token, this.secureCookieOptions);
    }

    /**
     * Retrieves the access token from the secure cookie
     * @returns string | null the access token or null if not found
     */
    public getToken(): string | null {
        const token = this.cookieService.get(ApiConstant.TOKEN_KEY);
        if (token === '') {
            return null;
        }
        return this.cookieService.get(ApiConstant.TOKEN_KEY);
    }

    /**
     * Sets the refresh token in a secure cookie
     * @param refreshToken string
     */
    public setRefreshToken(refreshToken: string): void {
        this.cookieService.set(ApiConstant.REFRESH_TOKEN_KEY, refreshToken, this.secureCookieOptions);
    }

    /**
     * Retrieves the refresh token from the secure cookie
     * @returns string | null the refresh token or null if not found
     */
    public getRefreshToken(): string | null {
        const refreshToken = this.cookieService.get(ApiConstant.REFRESH_TOKEN_KEY);
        if (refreshToken === '') {
            return null;
        }
        return this.cookieService.get(ApiConstant.REFRESH_TOKEN_KEY);
    }

    public clearTokens(): void {
        this.cookieService.delete(ApiConstant.TOKEN_KEY, '/', '', true);
        this.cookieService.delete(ApiConstant.REFRESH_TOKEN_KEY, '/', '', true);
    }

    public hasToken(): boolean {
        const token = this.getToken();
        return token !== null && token !== '';
    }

    public hasRefreshToken(): boolean {
        const refreshToken = this.getRefreshToken();
        return refreshToken !== null && refreshToken !== '';
    }

    public isTokenExpired(stringToken: string): boolean {
        if (!stringToken) {
            return true;
        }
        try {
            const decoded = this.getTokenPayload(stringToken);
            if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) {
                return true;
            }
            const exp = (decoded as { exp: number }).exp;
            const currentTime = Math.floor(Date.now() / 1000);
            return exp < currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
        }
        return true;
    }

    /**
     * get the payload of the token
     * @param stringToken 
     * @returns the payload of the token or null if it cannot be decoded
     */
    public getTokenPayload(stringToken: string): any | JwtPayload | null {
        if (!stringToken) {
            return null;
        }
        try {
            const decoded = jwtDecode(stringToken);
            if (!decoded || typeof decoded !== 'object') {
                return null;
            }
            return decoded as JwtPayload;
        } catch (error) {
            console.error('Error decoding token:', error);
        }
        return null;
    }

    /**
     * Decodes the token and checks if it is valid
     * @param stringToken the token to validate
     * @returns boolean true if the token is valid, false otherwise
     */
    public isTokenValid(stringToken: string): boolean {
        const payload = this.getTokenPayload(stringToken);
        if (!payload) {
            return false;
        }
        return !this.isTokenExpired(stringToken);
    }

}