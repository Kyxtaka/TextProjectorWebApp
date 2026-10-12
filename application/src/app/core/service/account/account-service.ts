import { inject, Service, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../../domain/user/user.service';
import { UserUpdateDto } from '../../../domain/user/dto/user-update.dto';
import { Role } from '../../common/constant/role.constant';
import { UserDto } from '../../../domain/user/dto/user.dto';

@Service()
export class AccountService {
    protected authanticated: boolean = false;
    public userData: WritableSignal<UserDto | null> = signal(null);
    private readonly userService = inject(UserService);

    public setCurrentUserInfos(user: UserDto): void {
        this.userData.set({
            uuid: user.uuid,
            id: user.id,
            username: user.username,
            email: user.email,
            permission: user.permission,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }

    public async getLoggedInUserProfile(): Promise<UserDto | null> {
        const user: UserDto | null = await this.userService.getLoggedInUserProfile();
        if (user) {
            this.setCurrentUserInfos(user);
            this.setAuthenticated(true);
        }
        return user;
    }

        
    public isCurrentUserAdmin(): boolean {
        return this.userData()?.permission === Role.ADMIN || this.userData()?.permission === Role.SUPER_ADMIN;
    }

    public isCurrentUserSuperAdmin(): boolean {
        return this.userData()?.permission === Role.SUPER_ADMIN;
    }

    public async updateUserProfile(userUpdateDto: UserUpdateDto): Promise<UserDto | null> {
        if (!this.userData) {
            throw new Error('User data is not set. Cannot update profile.');
        }

        const userEntity = await this.userService.findUserProfileByUuid(this.userData()?.uuid || '');
        if (!userEntity) {
            throw new Error('User not found. Cannot update profile.');
        }

        const updatedUser: UserDto | null = await this.userService.updateUser(userEntity, userUpdateDto);
        if (updatedUser) {
            this.setCurrentUserInfos(updatedUser);
            this.setAuthenticated(true);
        }
        return updatedUser;
    }

    public isAuthenticated(): boolean {
        return this.authanticated;
    }

    public setAuthenticated(authenticated: boolean): void {
        this.authanticated = authenticated;
    }

    public clearUserProfile(): void {
        this.setAuthenticated(false);
        this.userData.set(null);
    }

    public refreshUserProfile(): void {
        this.getLoggedInUserProfile()
        .then((user: UserDto | null) => {
            if (user) {
                this.setCurrentUserInfos(user);
            } else {
                this.clearUserProfile();
            }
        })
        .catch((error: unknown) => {
            console.error('Error refreshing user profile:', error);
            this.clearUserProfile();
        });
    }
}
