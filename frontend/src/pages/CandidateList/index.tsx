import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    CircularProgress,
    Alert,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { candidateService } from '../../services/api';
import { Candidate } from '../../interfaces/Candidate';

const CandidateList: React.FC = () => {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            console.log('Fetching candidates...');
            const data = await candidateService.getAll();
            console.log('Candidates received:', data);
            setCandidates(data);
            setError(null);
        } catch (err) {
            console.error('Error details:', err);
            setError('Error al cargar los candidatos. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleDeleteClick = (candidate: Candidate) => {
        setCandidateToDelete(candidate);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!candidateToDelete?.id) return;

        setLoading(true);
        try {
            await candidateService.delete(candidateToDelete.id);
            await fetchCandidates();
            setError(null);
        } catch (err) {
            console.error('Error deleting candidate:', err);
            setError('Error al eliminar el candidato. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setCandidateToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCandidateToDelete(null);
    };

    if (loading && candidates.length === 0) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Candidatos
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/candidates/new')}
                >
                    Nuevo Candidato
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Habilidades</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {candidates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay candidatos registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            candidates.map((candidate) => (
                                <TableRow key={candidate.id} hover>
                                    <TableCell>
                                        {candidate.firstName} {candidate.lastName}
                                    </TableCell>
                                    <TableCell>{candidate.email}</TableCell>
                                    <TableCell>{candidate.phone}</TableCell>
                                    <TableCell>
                                        {candidate.skills?.join(', ') || 'No especificadas'}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => navigate(`/candidates/${candidate.id}`)}
                                            >
                                                Ver Detalles
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                startIcon={<EditIcon />}
                                                onClick={() => navigate(`/candidates/${candidate.id}/edit`)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteClick(candidate)}
                                            >
                                                Eliminar
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea eliminar al candidato {candidateToDelete?.firstName} {candidateToDelete?.lastName}?
                        Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CandidateList; 