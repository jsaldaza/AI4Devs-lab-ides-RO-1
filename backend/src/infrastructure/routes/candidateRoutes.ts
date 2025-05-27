import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';

const router = Router();
const candidateController = new CandidateController();

// Rutas de candidatos
router.get('/', (req, res) => candidateController.getAllCandidates(req, res));
router.post('/', (req, res) => candidateController.createCandidate(req, res));
router.get('/:id', (req, res) => candidateController.getCandidateById(req, res));
router.put('/:id', (req, res) => candidateController.updateCandidate(req, res));
router.delete('/:id', (req, res) => candidateController.deleteCandidate(req, res));

export default router; 