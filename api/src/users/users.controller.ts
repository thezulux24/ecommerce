import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    @Get('me/addresses')
    findMyAddresses(@Request() req) {
        return this.usersService.findAddresses(req.user.userId);
    }
}
