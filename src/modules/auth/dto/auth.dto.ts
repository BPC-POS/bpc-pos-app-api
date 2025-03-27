import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
	@ApiProperty({ example: 'example@example.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: '123456aA@' })
	@IsString()
	@IsNotEmpty()
	password: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}
}
