import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
	@ApiProperty({ example: 'admin@gmail.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: '123456a@' })
	@IsString()
	@IsNotEmpty()
	password: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}
}
