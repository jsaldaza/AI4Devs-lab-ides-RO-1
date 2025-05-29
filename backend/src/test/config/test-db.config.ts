import { DataSource } from 'typeorm';
import { User } from '../../domain/entities/User';
import { Candidate } from '../../domain/entities/Candidate';
import { Education } from '../../domain/entities/Education';
import { WorkExperience } from '../../domain/entities/WorkExperience';
import { Document } from '../../domain/entities/Document';
import * as path from 'path';

export const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:', // Usar base de datos en memoria para pruebas
    entities: [User, Candidate, Education, WorkExperience, Document],
    synchronize: true,
    dropSchema: true,
    logging: false,
    // Configuraciones adicionales para SQLite
    enableWAL: false, // Deshabilitar Write-Ahead Logging
    busyErrorRetry: 1000, // Tiempo de espera para reintentar si la base de datos está ocupada
    // Configuraciones específicas para pruebas
    migrations: [],
    subscribers: [],
    // Configuraciones de TypeORM
    entitySkipConstructor: true, // Evitar problemas con constructores de entidades
}); 