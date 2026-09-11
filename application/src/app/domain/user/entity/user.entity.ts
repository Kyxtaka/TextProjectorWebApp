import { UserDto } from '../dto/user.dto';
export class User {
    private _uuid: string;
    private _id: number
    private _username: string;
    private _email: string;
    private _permission: string;
    private _createdAt: string;
    private _updatedAt: string;

    public constructor(uuid: string, id: number, username: string, email: string, permission: string, createdAt: string, updatedAt: string) {
        this._uuid = uuid;
        this._id = id;
        this._username = username;
        this._email = email;
        this._permission = permission;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    public get uuid(): string {
        return this._uuid;
    }

    public get id(): number {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }

    public get email(): string {
        return this._email;
    }

    public get permission(): string {
        return this._permission;
    }

    public get createdAt(): string {
        return this._createdAt;
    }

    public get updatedAt(): string {
        return this._updatedAt;
    }

    public static fromDto(dto: UserDto): User {
        return new User(dto.uuid, dto.id, dto.username, dto.email, dto.permission, dto.createdAt, dto.updatedAt);
    }
}