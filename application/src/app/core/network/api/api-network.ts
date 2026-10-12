import { inject, Service } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../../service/token/token-service';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment.development';

@Service()
export class ApiNetwork {
    private tokenService: TokenService = inject(TokenService); 
    private httpClient: HttpClient = inject(HttpClient);
    private readonly API_BASE_URL = environment.API_BASE_URL;

    public get<T>(url: string, authenticate: boolean, options?: {headers?: HttpHeaders, params?: HttpParams}): Observable<T> {
        const token = this.tokenService.getToken();
        let headers: HttpHeaders = options?.headers || new HttpHeaders();
        if (token && authenticate) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.httpClient.get<T>(`${this.API_BASE_URL}${url}`, { ...options, headers });
    }

    public post<T>(url: string, body: any, authenticate: boolean, options?: {headers?: HttpHeaders, params?: HttpParams}): Observable<T> {
        const token = this.tokenService.getToken();
        let headers: HttpHeaders = options?.headers || new HttpHeaders();
        if (token && authenticate) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.httpClient.post<T>(`${this.API_BASE_URL}${url}`, body, { ...options, headers });
    }

    public put<T>(url: string, body: any, authenticate: boolean, options?: {headers?: HttpHeaders, params?: HttpParams}): Observable<T> {
        const token = this.tokenService.getToken();
        let headers: HttpHeaders = options?.headers || new HttpHeaders();
        if (token && authenticate) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.httpClient.put<T>(`${this.API_BASE_URL}${url}`, body, { ...options, headers });
    }

    public delete<T>(url: string, authenticate: boolean, options?: {headers?: HttpHeaders, params?: HttpParams}): Observable<T> {
        const token = this.tokenService.getToken();
        let  headers: HttpHeaders = options?.headers || new HttpHeaders();
        if (token && authenticate) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.httpClient.delete<T>(`${this.API_BASE_URL}${url}`, { ...options, headers });
    }
}
