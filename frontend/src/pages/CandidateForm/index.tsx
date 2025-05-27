import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Chip,
    IconButton,
    Divider,
    CircularProgress,
    Alert,
    FormControlLabel,
    Switch
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { candidateService } from '../../services/api';
import { Candidate, Education, WorkExperience } from '../../interfaces/Candidate';

const emptyEducation: Education = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
};

const emptyWorkExperience: WorkExperience = {
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
    technologies: [],
    achievements: ''
};

const emptyCandidate: Omit<Candidate, 'id'> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    technicalSkills: [],
    yearsOfExperience: 0,
    currentPosition: '',
    preferredRole: '',
    education: [{ ...emptyEducation }],
    workExperience: [{ ...emptyWorkExperience }],
    isActive: true
};

const CandidateForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<Omit<Candidate, 'id'>>(emptyCandidate);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newSkill, setNewSkill] = useState('');
    const isEditMode = Boolean(id);

    useEffect(() => {
        const fetchCandidate = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await candidateService.getById(parseInt(id));
                console.log('Fetched candidate data:', data);
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    technicalSkills: data.technicalSkills || [],
                    yearsOfExperience: data.yearsOfExperience || 0,
                    currentPosition: data.currentPosition || '',
                    preferredRole: data.preferredRole || '',
                    education: data.education?.length > 0 ? data.education : [{ ...emptyEducation }],
                    workExperience: data.workExperience?.length > 0 ? data.workExperience : [{ ...emptyWorkExperience }],
                    isActive: data.isActive !== false
                });
            } catch (err) {
                console.error('Error fetching candidate:', err);
                setError('Error al cargar los datos del candidato');
            } finally {
                setLoading(false);
            }
        };

        if (isEditMode) {
            fetchCandidate();
        }
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEducationChange = (index: number, field: keyof Education, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const handleWorkExperienceChange = (index: number, field: keyof WorkExperience, value: string | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { ...emptyEducation }]
        }));
    };

    const removeEducation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const addWorkExperience = () => {
        setFormData(prev => ({
            ...prev,
            workExperience: [...prev.workExperience, { ...emptyWorkExperience }]
        }));
    };

    const removeWorkExperience = (index: number) => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience.filter((_, i) => i !== index)
        }));
    };

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            setFormData(prev => ({
                ...prev,
                technicalSkills: [...(prev.technicalSkills || []), newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            technicalSkills: (prev.technicalSkills || []).filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode && id) {
                await candidateService.update(parseInt(id), formData);
            } else {
                await candidateService.create(formData);
            }
            navigate('/candidates');
        } catch (error) {
            console.error('Error saving candidate:', error);
            setError('Error al guardar el candidato. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEditMode ? 'Editar Candidato' : 'Nuevo Candidato'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Nombre"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Apellido"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Teléfono"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dirección"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Posición Actual"
                                name="currentPosition"
                                value={formData.currentPosition}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Rol Preferido"
                                name="preferredRole"
                                value={formData.preferredRole}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Años de Experiencia"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        name="isActive"
                                    />
                                }
                                label="Candidato Activo"
                            />
                        </Grid>

                        {/* Technical Skills */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Habilidades Técnicas
                            </Typography>
                            <TextField
                                fullWidth
                                label="Añadir habilidad técnica"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={handleAddSkill}
                                placeholder="Presiona Enter para añadir"
                            />
                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {formData.technicalSkills?.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        onDelete={() => removeSkill(skill)}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Education */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Educación
                            </Typography>
                            {formData.education.map((edu, index) => (
                                <Box key={index} sx={{ mb: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Institución"
                                                value={edu.institution}
                                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Título"
                                                value={edu.degree}
                                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Campo de Estudio"
                                                value={edu.fieldOfStudy}
                                                onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                type="date"
                                                label="Fecha de Inicio"
                                                InputLabelProps={{ shrink: true }}
                                                value={edu.startDate}
                                                onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label="Fecha de Fin"
                                                InputLabelProps={{ shrink: true }}
                                                value={edu.endDate}
                                                onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                                                disabled={edu.current}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={edu.current}
                                                        onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                                                    />
                                                }
                                                label="Actualmente estudiando"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label="Descripción"
                                                value={edu.description}
                                                onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                    {formData.education.length > 1 && (
                                        <IconButton
                                            color="error"
                                            onClick={() => removeEducation(index)}
                                            sx={{ mt: 1 }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                    <Divider sx={{ my: 2 }} />
                                </Box>
                            ))}
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addEducation}
                                sx={{ mt: 1 }}
                            >
                                Añadir Educación
                            </Button>
                        </Grid>

                        {/* Work Experience */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Experiencia Laboral
                            </Typography>
                            {formData.workExperience.map((exp, index) => (
                                <Box key={index} sx={{ mb: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Empresa"
                                                value={exp.company}
                                                onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Cargo"
                                                value={exp.position}
                                                onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="Descripción"
                                                value={exp.description}
                                                onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                type="date"
                                                label="Fecha de Inicio"
                                                InputLabelProps={{ shrink: true }}
                                                value={exp.startDate}
                                                onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label="Fecha de Fin"
                                                InputLabelProps={{ shrink: true }}
                                                value={exp.endDate}
                                                onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                                                disabled={exp.current}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={exp.current}
                                                        onChange={(e) => handleWorkExperienceChange(index, 'current', e.target.checked)}
                                                    />
                                                }
                                                label="Trabajo actual"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Logros"
                                                multiline
                                                rows={2}
                                                value={exp.achievements}
                                                onChange={(e) => handleWorkExperienceChange(index, 'achievements', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                    {formData.workExperience.length > 1 && (
                                        <IconButton
                                            color="error"
                                            onClick={() => removeWorkExperience(index)}
                                            sx={{ mt: 1 }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                    <Divider sx={{ my: 2 }} />
                                </Box>
                            ))}
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addWorkExperience}
                                sx={{ mt: 1 }}
                            >
                                Añadir Experiencia Laboral
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            size="large"
                            disabled={loading}
                        >
                            {isEditMode ? 'Guardar Cambios' : 'Crear Candidato'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/candidates')}
                            size="large"
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CandidateForm; 