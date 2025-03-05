import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/index.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.usersService.create(createUserDto);
      return {
        success: true,
        payload: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: HttpStatus.BAD_REQUEST,
            message: (error as any).message,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.usersService.findAll();
      return {
        success: true,
        payload: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: (error as any).message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.usersService.findOne(+id);
      return {
        success: true,
        payload: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: HttpStatus.NOT_FOUND,
            message: (error as any).message,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.usersService.update(+id, updateUserDto);
      return {
        success: true,
        payload: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: HttpStatus.BAD_REQUEST,
            message: (error as any).message,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.usersService.remove(+id);
      return {
        success: true,
        payload: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: HttpStatus.NOT_FOUND,
            message: (error as any).message,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
