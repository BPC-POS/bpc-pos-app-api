import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './dto/index.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../../decorators/user.decorator';
import { Member } from '../../database/entities';

@ApiTags('Members')
@ApiBearerAuth()
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // @Post()
  // create(@Body() createMemberDto: CreateMemberDto) {
  //   return this.membersService.create(createMemberDto);
  // }

  // @Get()
  // findAll() {
  //   return this.membersService.findAll();
  // }

  @Get('me')
  findMe(@ReqUser() user: Member) {
    return this.membersService.findOne(+user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }
}
