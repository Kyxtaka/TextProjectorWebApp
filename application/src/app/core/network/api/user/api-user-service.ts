import { inject, Service } from '@angular/core';
import { ApiNetwork } from '../api-network';
import { firstValueFrom } from 'rxjs';
import { UserDto } from '../../../../domain/user/dto/user.dto';
import { UserCreateDto } from '../../../../domain/user/dto/user-create.dto';
import { UserUpdateDto } from '../../../../domain/user/dto/user-update.dto';

@Service()
export class ApiUserService {
    private static readonly API_USER_URL = '/users';
    private readonly apiNetwork = inject(ApiNetwork);

    public async findUserProfileByUuid(uuid: string): Promise<UserDto | null> {
        const url = `${ApiUserService.API_USER_URL}/${uuid}`;
        const response$ = this.apiNetwork.get<UserDto>(url, true);
        return await firstValueFrom(response$);
    }

    public async searchUsers(querySearch: string): Promise<UserDto[] | null> {
        const url = `${ApiUserService.API_USER_URL}?search=${encodeURIComponent(querySearch)}`;
        const response$ = this.apiNetwork.get<UserDto[]>(url, true);
        return await firstValueFrom(response$);
    }

    public async createUser(userData: UserCreateDto): Promise<UserDto | null> {
        const url = `${ApiUserService.API_USER_URL}`;
        const response$ = this.apiNetwork.post<UserDto>(url, userData, true);
        return await firstValueFrom(response$);
    }

    public async updateUser(uuid: string, userData: UserUpdateDto): Promise<UserDto | null> {
        const url = `${ApiUserService.API_USER_URL}/${uuid}`;
        const response$ = this.apiNetwork.put<UserDto>(url, userData, true);
        return await firstValueFrom(response$);
    }
}