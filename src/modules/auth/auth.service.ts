import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { Member } from '../../database/entities';
import { SignInDto } from './dto/auth.dto';
import { ErrorException } from '../../exceptions/error.exception';
// import Enum from '../../constants/enum';
// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

	async signToken(data: object) {
	if (!process.env.JWT_PRIVATE_KEY) {
		throw new Error('JWT_PRIVATE_KEY is not defined');
	}
	const cert = fs.readFileSync(process.env.JWT_PRIVATE_KEY);
		const token = await this.jwtService.signAsync(data, {
			algorithm: 'ES256',
			privateKey: cert,
		});
		return {
			token,
			expiresIn: '60m'
		};
	}

	hashPassword(password: string) {
    return bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUND));
	}

	comparePasswords(password: string, storedPasswordHash: string) {
		return bcrypt.compareSync(password, storedPasswordHash);
	}

	async signIn({ email, password }: SignInDto) {
		const user = await this.memberRepository.findOne({
      where: { email: email },
      select: ['id', 'password', 'status'],
    });

		if (!user) {
			throw new ErrorException(
				HttpStatus.NOT_FOUND,
				'signIn',
				'Email does not exist',
			);
		}

		try {
			const isAuth = this.comparePasswords(password, user.password);
			if (!isAuth) {
				throw new ErrorException(
					HttpStatus.BAD_REQUEST,
					'signIn',
					'password',
					'Mật khẩu không chính xác',
				);
			}
		} catch (error) {
      console.log(error);
			throw new ErrorException(HttpStatus.BAD_REQUEST, 'signIn', "Login failed");
		}

		const jwt = await this.signToken({ id: user.id });

		return {
			token: jwt.token,
			expiresIn: jwt.expiresIn,
		};
	}

}
