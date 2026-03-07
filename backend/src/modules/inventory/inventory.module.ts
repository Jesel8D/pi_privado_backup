import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRecord } from './entities/inventory-record.entity';
import { DailyInventorySnapshot } from './entities/daily-inventory-snapshot.entity';

@Module({
    imports: [TypeOrmModule.forFeature([InventoryRecord, DailyInventorySnapshot])],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService],
})
export class InventoryModule { }
