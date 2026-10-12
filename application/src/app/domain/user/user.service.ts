import { Service, inject } from '@angular/core';
import { Role } from '../../core/common/constant/role.constant';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { User } from './entity/user.entity';
import { ApiUserService } from '../../core/network/api/user/api-user-service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiAuthService } from '../../core/network/api/auth/api-auth-service';

@Service()
export class UserService {
    private readonly apiUserService = inject(ApiUserService);
    private readonly apiAuthService = inject(ApiAuthService);

    private async validateUserCreateDto(userData: UserCreateDto): Promise<UserCreateDto> {
        const dto = plainToInstance(UserCreateDto, userData);
        const errors = await validate(dto);
        if (errors.length > 0) {
            const messages = errors.flatMap((error) => Object.values(error.constraints ?? {}));
            throw new Error(messages.join(' '));
        }
        return dto;
    }

    public async findUserProfileByUuid(uuid: string): Promise<User | null> {
        const userDto = await this.apiUserService.findUserProfileByUuid(uuid);
        return userDto ? User.fromDto(userDto) : null;
    }

    public async getLoggedInUserProfile(): Promise<User | null> {
        const userDto = await this.apiAuthService.getUserProfile();
        console.log('User profile fetched:', userDto);
        return userDto ? User.fromDto(userDto) : null;
    }

    public async searchUsers(querySearch: string): Promise<User[] | null> {
        const users = await this.apiUserService.searchUsers(querySearch);
        return  users ? users.map((user) => User.fromDto(user)) : null;
    }

    public async createUser(userData: UserCreateDto): Promise<User | null> {
        const validatedUserData = await this.validateUserCreateDto(userData);
        const createdUser = await this.apiUserService.createUser(validatedUserData);
        return createdUser ? User.fromDto(createdUser) : null;
    }

    private async validateUserUpdateDto(userData: UserUpdateDto): Promise<UserUpdateDto> {
        const dto = plainToInstance(UserUpdateDto, userData);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const messages = errors.flatMap((error) => Object.values(error.constraints ?? {}));
            throw new Error(messages.join(' '));
        }

        return dto;
    }

    public async updateUser(UserEntity: User, userUpdateDto: UserUpdateDto): Promise<User | null> {
        const user = await this.apiUserService.findUserProfileByUuid(UserEntity.uuid);
        if (!user) {
            throw new Error(`User with UUID ${UserEntity.uuid} not found.`);
        }
        const validatedUserUpdateDto = await this.validateUserUpdateDto(userUpdateDto);
        const editInformation: UserUpdateDto = {}
        if (validatedUserUpdateDto.username !== undefined) {
            editInformation['username'] = validatedUserUpdateDto.username;
        }
        if (validatedUserUpdateDto.email !== undefined) {
            editInformation['email'] = validatedUserUpdateDto.email;
        }
        if (validatedUserUpdateDto.password !== undefined) {
            editInformation['password'] = validatedUserUpdateDto.password;
        }
        if (validatedUserUpdateDto.permission !== undefined) {
            editInformation['permission'] = validatedUserUpdateDto.permission;
        }
        const updatedUser = await this.apiUserService.updateUser(user.uuid, editInformation);
        return updatedUser ? User.fromDto(updatedUser) : null;
    }

}