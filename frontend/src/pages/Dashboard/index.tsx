import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button
} from '@mui/material';
import {
    Person as PersonIcon,
    Add as AddIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard de Reclutamiento
            </Typography>

            <Grid container spacing={3}>
                {/* Tarjeta de Candidatos */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            },
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                                <Typography variant="h5" component="h2">
                                    Candidatos
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Gestiona los perfiles de candidatos, revisa sus CVs y actualiza su información.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/candidates/new')}
                                fullWidth
                            >
                                Añadir Candidato
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tarjeta de Lista de Candidatos */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            },
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AssessmentIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                                <Typography variant="h5" component="h2">
                                    Lista de Candidatos
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Visualiza y gestiona todos los candidatos en el sistema.
                            </Typography>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/candidates')}
                                fullWidth
                            >
                                Ver Candidatos
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 