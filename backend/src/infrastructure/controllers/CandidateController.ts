import { Request, Response } from 'express';
import { AppDataSource } from '../typeorm.config';
import { Candidate } from '../../domain/entities/Candidate';
import { QueryFailedError } from 'typeorm';

export class CandidateController {
    private candidateRepository = AppDataSource.getRepository(Candidate);

    // GET /candidates
    async getAllCandidates(_req: Request, res: Response): Promise<void> {
        try {
            const candidates = await this.candidateRepository.find({
                where: { isActive: true },
                relations: ['education', 'workExperience']
            });
            res.json({ success: true, data: candidates });
        } catch (error) {
            console.error('Error al obtener candidatos:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    // POST /candidates
    async createCandidate(req: Request, res: Response): Promise<void> {
        try {
            const candidateData = req.body;

            // Crear instancia de Candidate
            const newCandidate = new Candidate();
            Object.assign(newCandidate, candidateData);

            // Establecer fecha de retención (6 meses desde la creación)
            const retentionDate = new Date();
            retentionDate.setMonth(retentionDate.getMonth() + 6);
            newCandidate.dataRetentionDate = retentionDate;

            const savedCandidate = await this.candidateRepository.save(newCandidate);
            res.status(201).json({ success: true, data: savedCandidate });
        } catch (error) {
            console.error('Error al crear candidato:', error);
            if (error instanceof QueryFailedError && error.message.includes('duplicate key')) {
                res.status(400).json({
                    success: false,
                    message: 'Ya existe un candidato con este email'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al crear el candidato'
                });
            }
        }
    }

    // GET /candidates/:id
    async getCandidateById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }

            const candidate = await this.candidateRepository.findOne({
                where: { id, isActive: true },
                relations: ['education', 'workExperience']
            });

            if (!candidate) {
                res.status(404).json({
                    success: false,
                    message: 'Candidato no encontrado'
                });
                return;
            }

            res.json({ success: true, data: candidate });
        } catch (error) {
            console.error('Error al obtener candidato:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // PUT /candidates/:id
    async updateCandidate(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const updateData = req.body;

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }

            const candidate = await this.candidateRepository.findOne({
                where: { id, isActive: true },
                relations: ['education', 'workExperience']
            });

            if (!candidate) {
                res.status(404).json({
                    success: false,
                    message: 'Candidato no encontrado'
                });
                return;
            }

            // Update candidate data
            Object.assign(candidate, updateData);

            const updatedCandidate = await this.candidateRepository.save(candidate);
            res.json({ success: true, data: updatedCandidate });
        } catch (error) {
            console.error('Error al actualizar candidato:', error);
            if (error instanceof QueryFailedError && error.message.includes('duplicate key')) {
                res.status(400).json({
                    success: false,
                    message: 'Ya existe un candidato con este email'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al actualizar el candidato'
                });
            }
        }
    }

    // DELETE /candidates/:id
    async deleteCandidate(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
                return;
            }

            const candidate = await this.candidateRepository.findOne({
                where: { id, isActive: true }
            });

            if (!candidate) {
                res.status(404).json({
                    success: false,
                    message: 'Candidato no encontrado'
                });
                return;
            }

            // Soft delete - just mark as inactive
            candidate.isActive = false;
            await this.candidateRepository.save(candidate);

            res.json({ success: true, message: 'Candidato eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar candidato:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el candidato'
            });
        }
    }
} 