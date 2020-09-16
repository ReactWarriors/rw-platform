import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthGuard } from '../shared/auth.guard';

@Controller('')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get(['users', 'staff/users'])
  @UseGuards(new AuthGuard())
  getAll() {
    return this.usersService.findAll();
  }

  @Put('staff/users/:id/update_role')
  @UseGuards(new AuthGuard())
  async updateRole(@Param('id') id: string, @Body() data: any) {
    const user = await this.usersService.find(id);
    return this.usersService.updateRole(user, data.role);
  }
}
