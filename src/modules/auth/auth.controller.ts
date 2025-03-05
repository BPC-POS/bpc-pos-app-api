import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';
import { PublicRoute } from '../../decorators/public-route.decorator';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const result = await this.authService.signIn(signInDto);
    return result;
  }
}
