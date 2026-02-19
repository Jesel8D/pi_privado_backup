import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DailySale } from './entities/daily-sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { Product } from '../products/entities/product.entity';
import { PrepareDailySaleDto } from './dto/prepare-daily-sale.dto';
import { TrackSaleDto } from './dto/track-sale.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(DailySale)
        private readonly dailySaleRepository: Repository<DailySale>,
        @InjectRepository(SaleDetail)
        private readonly saleDetailRepository: Repository<SaleDetail>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly dataSource: DataSource,
    ) { }

    /**
     * Finds today's active sales record for the user.
     */
    async findToday(user: User): Promise<DailySale | null> {
        return await this.dailySaleRepository.findOne({
            where: {
                sellerId: user.id,
                saleDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            },
            relations: ['details', 'details.product'],
        });
    }

    /**
     * Initializes a new daily sale record with prepared items.
     */
    async prepareDay(prepareDto: PrepareDailySaleDto, user: User): Promise<DailySale> {
        const existing = await this.findToday(user);
        if (existing) {
            throw new BadRequestException('Daily sale already initialized for today. Use update methods instead.');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Calculate Initial Investment
            let totalInvestment = 0;
            const details: SaleDetail[] = [];

            for (const item of prepareDto.items) {
                const product = await this.productRepository.findOneBy({ id: item.productId });
                if (!product) throw new BadRequestException(`Product ${item.productId} not found`);

                const detail = new SaleDetail();
                detail.product = product;
                detail.productId = product.id;
                detail.quantityPrepared = item.quantityPrepared;
                detail.unitCost = product.unitCost;
                detail.unitPrice = product.salePrice;
                // detail.subtotal handled by DB generation ideally, but here we init

                totalInvestment += Number(product.unitCost) * item.quantityPrepared;
                details.push(detail);
            }

            // 2. Create Header
            const dailySale = new DailySale();
            dailySale.seller = user;
            dailySale.sellerId = user.id;
            dailySale.totalInvestment = totalInvestment;
            dailySale.saleDate = new Date().toISOString().split('T')[0];

            const savedSale = await queryRunner.manager.save(DailySale, dailySale);

            // 3. Save Details
            for (const detail of details) {
                detail.dailySale = savedSale;
                await queryRunner.manager.save(SaleDetail, detail);
            }

            await queryRunner.commitTransaction();

            // Return with relations
            const result = await this.dailySaleRepository.findOne({
                where: { id: savedSale.id },
                relations: ['details', 'details.product'],
            });

            if (!result) throw new NotFoundException('Error saving sale');
            return result;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Updates sold/lost quantities for a specific product in today's sale.
     */
    async trackProduct(trackDto: TrackSaleDto, user: User): Promise<DailySale> {
        const dailySale = await this.findToday(user);
        if (!dailySale) {
            throw new NotFoundException('No active daily sale found for today. Please initialize the day first.');
        }

        const detail = dailySale.details.find(d => d.productId === trackDto.productId);
        if (!detail) {
            // Optional: Auto-add logic if product wasn't prepared? For now, throw error.
            throw new NotFoundException('Product not found in today\'s records');
        }

        // Validate
        if (detail.quantityPrepared < (trackDto.quantitySold + trackDto.quantityLost)) {
            throw new BadRequestException('Cannot sell/lose more than prepared quantity');
        }

        // Update Detail
        detail.quantitySold = trackDto.quantitySold;
        detail.quantityLost = trackDto.quantityLost;
        await this.saleDetailRepository.save(detail);

        // Recalculate Header Stats (Revenue, Units)
        // Note: total_profit and subtotal are DB generated/stored, but let's update aggregated fields in app logic too if needed for immediate response
        return await this.recalculateHeader(dailySale.id);
    }

    private async recalculateHeader(dailySaleId: string): Promise<DailySale> {
        const sale = await this.dailySaleRepository.findOne({
            where: { id: dailySaleId },
            relations: ['details']
        });

        if (!sale) throw new NotFoundException('Sale not found');

        let totalRevenue = 0;
        let unitsSold = 0;
        let unitsLost = 0;

        for (const detail of sale.details) {
            totalRevenue += Number(detail.unitPrice) * detail.quantitySold;
            unitsSold += detail.quantitySold;
            unitsLost += detail.quantityLost;
        }

        sale.totalRevenue = totalRevenue;
        sale.unitsSold = unitsSold;
        sale.unitsLost = unitsLost;

        // Profit & Margin
        const profit = totalRevenue - Number(sale.totalInvestment);
        sale.profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

        // Note: totalProfit is generated column in DB, but we do not write to it. 
        // If it was a real column we would set it here.

        return await this.dailySaleRepository.save(sale);
    }
}
