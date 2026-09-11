/**
 * Represents a user in the system.
 */
export interface UserDto {
    uuid: string;
    id: number;
    username: string;
    email: string;
    permission: string;
    createdAt: string;
    updatedAt: string;
}

