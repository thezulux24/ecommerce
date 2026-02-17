import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class StatsController {
    constructor(private statsService: StatsService) { }

    @Get('dashboard')
    getDashboardStats() {
        return this.statsService.getDashboardStats();
    }

    @Get('report')
    getReportData() {
        return this.statsService.getReportData();
    }
}
