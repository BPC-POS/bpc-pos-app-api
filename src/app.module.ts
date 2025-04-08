import { registerArrayExtensions } from './boilerplate.polyfill.ts';

registerArrayExtensions();

import path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module.ts';
import { ApiConfigService } from './shared/services/api-config.service.ts';
import { SharedModule } from './shared/shared.module.ts';
import { CouponsModule } from './modules/coupons/coupons.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { LoyaltyPointsModule } from './modules/loyalty-points/loyalty-points.module';
import { MembersModule } from './modules/members/members.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductAttributesModule } from './modules/product-attributes/product-attributes.module';
import { ProductCategoriesModule } from './modules/product-categories/product-categories.module';
import { RbacActionsModule } from './modules/rbac-actions/rbac-actions.module';
import { RbacModulesModule } from './modules/rbac-modules/rbac-modules.module';
import { RolesModule } from './modules/roles/roles.module';
import { RoleActionsModule } from './modules/role-actions/role-actions.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module.ts';
import { TablesModule } from './modules/tables/tables.module';
import { TableAreaModule } from './modules/table-area/table-area.module';
import { ShiftsModule } from './modules/shifts/shifts.module.ts';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(import.meta.dirname!, 'i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
    CouponsModule,
    DiscountsModule,
    EmployeesModule,
    InventoryModule,
    LoyaltyPointsModule,
    // LoyaltyTransactionsModule,
    MembersModule,
    OrdersModule,
    // OrderItemsModule,
    // OtpsModule,
    // PaymentsModule,
    ProductAttributesModule,
    // ProductAttributeValuesModule,
    ProductCategoriesModule,
    // ProductCategoryMappingsModule,
    // ProductTagsModule,
    // ProductTaxesModule,
    // ProductVariantsModule,
    // PurchaseOrdersModule,
    // PurchaseOrderItemsModule,
    RbacActionsModule,
    RbacModulesModule,
    // ReturnsModule,
    // ReturnItemsModule,
    RolesModule,
    RoleActionsModule,
    ShiftsModule,
    // SuppliersModule,
    ProductsModule,
    // UsersModule,
    AuthModule,
    TablesModule,
    TableAreaModule,
  ],
  providers: [],
})
export class AppModule {}
