import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats') @Public()
  getStats() { return this.dashboardService.getStats(); }

  @Get('recent-styles') @Public()
  getRecentStyles() { return this.dashboardService.getRecentStyles(); }

  @Get('recent-fabrics') @Public()
  getRecentFabrics() { return this.dashboardService.getRecentFabrics(); }

  @Get('most-used-fabrics') @ApiBearerAuth('JWT')
  getMostUsedFabrics() { return this.dashboardService.getMostUsedFabrics(); }

  @Get('brick-distribution') @ApiBearerAuth('JWT')
  getBrickDistribution() { return this.dashboardService.getBrickNameDistribution(); }

  @Get('upload-trends') @ApiBearerAuth('JWT')
  getUploadTrends() { return this.dashboardService.getUploadTrends(); }
}
