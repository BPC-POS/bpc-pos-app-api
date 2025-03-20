import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../../database/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guards/auth.guard';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([Member])],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    AuthGuard,
  ],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
