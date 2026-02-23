import { Controller, Post, Get, Headers, UseGuards, UnauthorizedException } from '@nestjs/common';
import { BenchmarkingService } from './benchmarking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('benchmarking')
export class BenchmarkingController {
    constructor(private readonly benchmarkingService: BenchmarkingService) { }

    /**
     * Endpoint para realizar el "Corte del Día".
     * Extrae métricas de PostgreSQL y las envía a BigQuery.
     * Requiere el token de Google del usuario en el header Authorization.
     */
    @Post('snapshot')
    // @UseGuards(JwtAuthGuard) // Podemos comentar esto si el token de Google es el único necesario, 
    // pero idealmente validamos que sea un usuario del sistema.
    async takeSnapshot(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('Se requiere token de autenticación (Google OAuth)');
        }
        return this.benchmarkingService.processDailySnapshot(authHeader);
    }

    /**
     * Endpoint para ejecutar las consultas de prueba registradas.
     */
    @Post('run-queries')
    async runQueries() {
        await this.benchmarkingService.runRegisteredQueries();
        return { message: 'Consultas de benchmarking ejecutadas con éxito' };
    }

    /**
     * Obtiene el ID del proyecto actual para referencia del cliente.
     */
    @Get('project')
    async getProject() {
        const projectId = await this.benchmarkingService.getCurrentProjectId();
        return { project_id: projectId };
    }

    /**
     * Endpoint para verificar cuántos datos hay en BigQuery.
     */
    @Post('verify-status')
    async verifyStatus(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('Se requiere token de autenticación (Google OAuth)');
        }
        return this.benchmarkingService.verifyBigQueryData(authHeader);
    }
}
