import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResult } from '@nestjs/terminus';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { ServiceHealthIndicator } from './health-indicators/service.indicator.ts';
import { PublicRoute } from '../../decorators/public-route.decorator.ts';

@Controller('health')
export class HealthCheckerController {
  constructor(
    private healthCheckService: HealthCheckService,
    private ormIndicator: TypeOrmHealthIndicator,
    private serviceIndicator: ServiceHealthIndicator,
  ) {}

  @PublicRoute()
  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.ormIndicator.pingCheck('database', { timeout: 1500 }),
      () => this.serviceIndicator.isHealthy('search-service-health'),
    ]);
  }
}
