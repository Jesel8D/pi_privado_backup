import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { DailySale } from './entities/daily-sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { Product } from '../products/entities/product.entity';
import { InventoryRecord } from '../inventory/entities/inventory-record.entity';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [TypeOrmModule.forFeature([DailySale, SaleDetail, Product, InventoryRecord]), InventoryModule],
    controllers: [SalesController],
    providers: [SalesService],
    exports: [SalesService],
})
export class SalesModule { }
