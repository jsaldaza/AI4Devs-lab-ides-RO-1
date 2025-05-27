import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LinkedIn as LinkedInIcon,
    Language as LanguageIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { candidateService } from '../../services/api';
import { Candidate } from '../../interfaces/Candidate';

const CandidateDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            if (!id) return;
            try {
                console.log('Fetching candidate with ID:', id);
                const data = await candidateService.getById(parseInt(id));
                console.log('Received candidate data:', data);
                setCandidate(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching candidate:', err);
                setError('Error al cargar los datos del candidato');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [id]);

    // Add debug logs
    console.log('Component state:', { loading, error, candidate });

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !candidate) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error || 'No se encontró el candidato'}</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/candidates')}
                    sx={{ mt: 2 }}
                >
                    Volver a la lista
                </Button>
            </Container>
        );
    }

    // Add debug log before rendering
    console.log('Rendering candidate:', candidate);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/candidates')}
                >
                    Volver
                </Button>
                <Typography variant="h4" component="h1">
                    {candidate.firstName} {candidate.lastName}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Información Personal */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Información Personal
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon color="action" />
                                            <Typography>{candidate.email}</Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon color="action" />
                                            <Typography>{candidate.phone}</Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {candidate.linkedIn && (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinkedInIcon color="action" />
                                                <Typography>{candidate.linkedIn}</Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            )}
                            {candidate.portfolio && (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LanguageIcon color="action" />
                                                <Typography>{candidate.portfolio}</Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Resumen */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Resumen Profesional
                        </Typography>
                        <Typography>{candidate.summary}</Typography>
                    </Paper>
                </Grid>

                {/* Habilidades */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Habilidades Técnicas
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {(candidate.skills || []).map((skill, index) => (
                                <Chip key={index} label={skill} />
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Educación */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Educación
                        </Typography>
                        {(candidate.education || []).map((edu, index) => (
                            <Card key={index} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {edu.degree} en {edu.fieldOfStudy}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {edu.institution}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(edu.startDate).toLocaleDateString()} -
                                        {edu.current ? 'Presente' : edu.endDate ? new Date(edu.endDate).toLocaleDateString() : ''}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                </Grid>

                {/* Experiencia Laboral */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Experiencia Laboral
                        </Typography>
                        {(candidate.workExperience || []).map((exp, index) => (
                            <Card key={index} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {exp.position}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {exp.company}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(exp.startDate).toLocaleDateString()} -
                                        {exp.current ? 'Presente' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {exp.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CandidateDetail; 