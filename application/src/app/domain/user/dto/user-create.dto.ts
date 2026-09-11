import  { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, Matches, MinLength } from 'class-validator';
import { Match } from '../../../core/common/validator/match-validator/match.validator';
import { Role } from '../../../core/common/constant/role.constant';
import { Transform } from 'class-transformer';

export class UserCreateDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    public username!: string;

    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.trim())
    public email!: string;

    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(/(?=(?:.*[A-Z]){1})/, {
        message: 'Le mot de passe doit contenir au moins 1 lettre majuscule'
    })
    @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
        message: 'Le mot de passe doit contenir au moins 1 caractère spécial'
    })
    @Matches(/(?=(?:.*\d){4})/, {
        message: 'Le mot de passe doit contenir au moins 4 chiffres'
    })
    public password!: string;
    
    @IsNotEmpty({ message: 'La confirmation du mot de passe est requise' })
    @Match('password', { message: 'La confirmation du mot de passe ne correspond pas' })
    public confirmPassword!: string;

    @IsOptional()
    @IsEnum(Role, { message: 'Le rôle doit être ADMIN, MEMBER ou SUPER_ADMIN' })
    public permission?: Role;
}   