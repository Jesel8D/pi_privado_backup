import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BigQuery } from '@google-cloud/bigquery';
import { Project } from './entities/project.entity';
import { Query } from './entities/query.entity';

@Injectable()
export class BenchmarkingService {
    private readonly logger = new Logger(BenchmarkingService.name);

    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(Query)
        private readonly queryRepository: Repository<Query>,
    ) { }

    /**
     * Obtiene el ID del proyecto actual o crea uno por defecto si no existe.
     */
    async getCurrentProjectId(): Promise<number> {
        let project = await this.projectRepository.findOne({ where: {} });
        if (!project) {
            project = this.projectRepository.create({
                project_type: 'ECOMMERCE' as any,
                description: 'TienditaCampus - Sistema de Comercio Electrónico Universitario',
                db_engine: 'POSTGRESQL' as any,
            });
            project = await this.projectRepository.save(project);
        }
        return project.project_id;
    }

    /**
     * Ejecuta todas las consultas registradas para generar métricas.
     */
    async runRegisteredQueries(): Promise<void> {
        const queries = await this.queryRepository.find();
        for (const q of queries) {
            try {
                await this.entityManager.query(q.query_sql);
                this.logger.log(`Consulta ejecutada: ${q.query_description}`);
            } catch (error) {
                this.logger.error(`Error al ejecutar consulta "${q.query_description}": ${error.message}`);
            }
        }
    }

    /**
     * Captura el snapshot actual de pg_stat_statements y lo envía a BigQuery.
     */
    async processDailySnapshot(authHeader: string): Promise<any> {
        // Extraer token de Bearer authHeader
        const accessToken = authHeader.replace('Bearer ', '');
        if (!accessToken) throw new BadRequestException('OAuth token is required');

        const projectId = await this.getCurrentProjectId();

        // 1. Consultar pg_stat_statements
        const stats = await this.entityManager.query(`
            SELECT 
                $1::int as project_id,
                CURRENT_DATE as snapshot_date,
                queryid::text as queryid,
                dbid,
                userid,
                query,
                calls,
                total_exec_time as total_exec_time_ms,
                mean_exec_time as mean_exec_time_ms,
                min_exec_time as min_exec_time_ms,
                max_exec_time as max_exec_time_ms,
                stddev_exec_time as stddev_exec_time_ms,
                rows as rows_returned,
                shared_blks_hit,
                shared_blks_read,
                shared_blks_dirtied,
                shared_blks_written,
                temp_blks_read,
                temp_blks_written
            FROM pg_stat_statements
            WHERE calls > 0
            LIMIT 50;
        `, [projectId]);

        if (stats.length === 0) {
            return { message: 'No hay métricas nuevas para enviar' };
        }

        // 2. Enviar a BigQuery usando el token del usuario
        try {
            const bigquery = new BigQuery({
                projectId: 'data-from-software',
                credentials: { access_token: accessToken }
            } as any);

            const datasetId = 'benchmarking_warehouse';
            const tableId = 'daily_query_metrics';

            // Insertar filas
            await bigquery
                .dataset(datasetId)
                .table(tableId)
                .insert(stats);

            this.logger.log(`Enviados ${stats.length} registros a BigQuery exitosamente.`);

            // 3. Solo si el envío fue exitoso, resetear estadísticas
            await this.entityManager.query('SELECT pg_stat_statements_reset();');

            return {
                success: true,
                count: stats.length,
                message: 'Snapshot enviado y estadísticas reiniciadas'
            };

        } catch (error) {
            this.logger.error(`Error al enviar a BigQuery: ${error.message}`);
            throw new BadRequestException(`Fallo en envío a BigQuery: ${error.message}`);
        }
    }

    /**
     * Verifica cuántos registros existen en BigQuery para el proyecto actual.
     * Réplica de la funcionalidad del notebook de Colab.
     */
    async verifyBigQueryData(authHeader: string): Promise<any> {
        const accessToken = authHeader.replace('Bearer ', '');
        if (!accessToken) throw new BadRequestException('OAuth token is required');

        const projectId = await this.getCurrentProjectId();

        try {
            const bigquery = new BigQuery({
                projectId: 'data-from-software',
                credentials: { access_token: accessToken }
            } as any);

            // Consulta de conteo similar a la del screenshot
            const query = `
                SELECT COUNT(*) as total 
                FROM \`data-from-software.benchmarking_warehouse.daily_query_metrics\`
                WHERE project_id = @projectId
            `;

            const options = {
                query: query,
                params: { projectId: projectId }
            };

            const [rows] = await bigquery.query(options);

            return {
                total: rows.length > 0 ? parseInt(rows[0].total) : 0,
                project_id: projectId,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            this.logger.error(`Error al verificar BigQuery: ${error.message}`);
            throw new BadRequestException(`No se pudo verificar BigQuery: ${error.message}`);
        }
    }
}
