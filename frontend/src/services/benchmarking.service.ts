import { api } from './api';

export interface BenchmarkingProject {
    project_id: number;
}

export const benchmarkingService = {
    /**
     * Envía el snapshot diario a BigQuery.
     * @param googleToken El token de acceso obtenido de Google OAuth.
     */
    async sendSnapshot(googleToken: string) {
        return api.post('/benchmarking/snapshot', {}, {
            headers: {
                Authorization: `Bearer ${googleToken}`
            }
        });
    },

    /**
     * Ejecuta las consultas registradas para estresar la BD y generar métricas.
     */
    async runQueries() {
        return api.post('/benchmarking/run-queries', {});
    },

    /**
     * Obtiene información del proyecto actual.
     */
    async getProject(): Promise<BenchmarkingProject> {
        return api.get<BenchmarkingProject>('/benchmarking/project');
    }
};
