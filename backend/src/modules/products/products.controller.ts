import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming JwtAuthGuard exists in auth module
import { User } from '../users/entities/user.entity';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
        return this.productsService.create(createProductDto, req.user as User);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.productsService.findAll(req.user as User);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.productsService.findOne(id, req.user as User);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Req() req: any,
    ) {
        return this.productsService.update(id, updateProductDto, req.user as User);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.productsService.remove(id, req.user as User);
    }
}
