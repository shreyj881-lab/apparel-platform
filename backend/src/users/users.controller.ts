import { Controller, Get, Param, Patch, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query('search') search?: string) {
    return this.usersService.findAll(+page, +limit, search);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  getStats() { return this.usersService.getStats(); }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) { return this.usersService.findOne(id); }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.usersService.updateRole(id, role);
  }

  @Patch(':id/toggle-status')
  @Roles(UserRole.ADMIN)
  toggleStatus(@Param('id') id: string) { return this.usersService.toggleStatus(id); }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: string) { return this.usersService.delete(id); }
}
