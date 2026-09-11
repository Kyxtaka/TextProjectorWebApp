export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface TokenPayload {
    email: string;
    exp: number;
    iat: number;
    sub: string;
    role: string;
    jti: string;
    jwt_type: string;
}
