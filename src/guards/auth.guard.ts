import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../database/entities';
import { PUBLIC_ROUTE_KEY } from '../decorators/public-route.decorator';
import { ErrorException } from '../exceptions/error.exception';
import { Request } from 'express';
import * as fs from 'fs';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,

        @InjectRepository(Member)
        private readonly userRepository: Repository<Member>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new ErrorException(
                HttpStatus.UNAUTHORIZED,
                'AuthGuard',
                'Not found token',
            );
        }
        try {
            const publicKeyPath = process.env.JWT_PUBLIC_KEY;
            if (!publicKeyPath) {
                throw new ErrorException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'AuthGuard',
                    'JWT public key path is not defined',
                );
            }
            const pubCert = fs.readFileSync(publicKeyPath);

            const payload = await this.jwtService.verifyAsync(token, {
                publicKey: pubCert,
            });

            const user = await this.userRepository.findOne({
              where: { id: payload.id },
            });

            if (!user) {
                throw new ErrorException(
                    HttpStatus.UNAUTHORIZED,
                    'Authentication Error',
                    'payload ',
                );
            }

            request['state'] = { user: user };
        } catch (error) {
            throw new ErrorException(
                HttpStatus.UNAUTHORIZED,
                'Authentication Error',
                'Invalid token',
            );
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
