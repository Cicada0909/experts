import { useState, useEffect } from 'react'
import { apiRequest } from '../../../utils/api.js'
import {
    getMyServices,
    deleteServices,
    createService,
    updateService,
} from '../api/expertsApi'
import { getCategories } from '../../Categories/api/getCategories'
import {
    Box,
    Typography,
    Button,
    IconButton,
    Card,
    CardContent,
    Collapse,
    Modal,
    TextField,
    Alert,
    CircularProgress,
    Container,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import styles from './Services.module.css'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'

const Services = () => {
    const [services, setServices] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [selectedServiceId, setSelectedServiceId] = useState(null)
    const [expandedServiceId, setExpandedServiceId] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category_id: 1,
    })
    const [formErrors, setFormErrors] = useState({})

    const navigate = useNavigate()

    const fetchServices = async () => {
        try {
            setLoading(true)
            const [servicesResponse, categoriesResponse] = await Promise.all([
                getMyServices(),
                getCategories(),
            ])
            setServices(servicesResponse)
            setCategories(categoriesResponse)
        } catch (err) {
            setError('Ошибка при загрузке данных')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const handleOpenCreateModal = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            category_id: categories[0]?.id || 1,
        })
        setFormErrors({})
        setOpenCreateModal(true)
    }

    const handleOpenEditModal = (service) => {
        setFormData({
            title: service.title,
            description: service.description,
            price: service.price.toString(),
            category_id: service.category_id,
        })
        setSelectedServiceId(service.id)
        setFormErrors({})
        setOpenEditModal(true)
    }

    const handleOpenDeleteModal = (serviceId) => {
        setSelectedServiceId(serviceId)
        setOpenDeleteModal(true)
    }

    const validateForm = () => {
        const errors = {}
        if (!formData.title) errors.title = 'Название обязательно'
        else if (formData.title.length > 60)
            errors.title = 'Название не должно превышать 60 символов'
        if (!formData.description) errors.description = 'Описание обязательно'
        else if (formData.description.length > 800)
            errors.description = 'Описание не должно превышать 800 символов'
        if (!formData.price) errors.price = 'Цена обязательна'
        else if (isNaN(formData.price) || Number(formData.price) > 999999)
            errors.price = 'Цена должна быть числом до 999999'
        if (!formData.category_id) errors.category_id = 'Категория обязательна'
        return errors
    }

    const handleCreateService = async () => {
        const errors = validateForm()
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }
        try {
            await createService(formData)
            setOpenCreateModal(false)
            fetchServices()
        } catch (err) {
            setError('Ошибка при создании курса')
        }
    }

    const handleUpdateService = async () => {
        const errors = validateForm()
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }
        try {
            await updateService(selectedServiceId, formData)
            setOpenEditModal(false)
            fetchServices()
        } catch (err) {
            setError('Ошибка при обновлении курса')
        }
    }

    const handleDeleteService = async () => {
        try {
            await deleteServices(selectedServiceId)
            setOpenDeleteModal(false)
            fetchServices()
        } catch (err) {
            setError('Ошибка при удалении курса')
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const toggleExpand = (serviceId) => {
        setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId)
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <Container className={styles.wrapper} sx={{ pb: '80px' }}>
            <IconButton
                aria-label="back"
                size="large"
                sx={{
                    color: 'primary.main',
                    alignSelf: 'flex-start',
                    marginBottom: '1rem',
                }}
                onClick={() => handleGoBack()}
            >
                <ArrowBack fontSize="large" />
            </IconButton>
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
            >
                <Typography variant="h5">Мои курсы</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateModal}
                >
                    Добавить курс
                </Button>
            </Box>

            {loading && (
                <CircularProgress
                    sx={{ display: 'block', mx: 'auto', my: 2 }}
                />
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box className={styles.items}>
                {services
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                    )
                    .map((service) => (
                        <Card
                            key={service.id}
                            sx={{ mb: 2, position: 'relative' }}
                        >
                            <IconButton
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                                onClick={() =>
                                    handleOpenDeleteModal(service.id)
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                            <CardContent
                                sx={{ paddingBottom: '1rem !important' }}
                            >
                                <Typography variant="h6">
                                    {service.title}
                                </Typography>
                                <Collapse in={expandedServiceId === service.id}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        Категория: {service.category.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 1, mb: 2 }}
                                    >
                                        {service.description}
                                    </Typography>
                                </Collapse>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 1,
                                    }}
                                >
                                    <Button
                                        onClick={() =>
                                            handleOpenEditModal(service)
                                        }
                                    >
                                        Редактировать
                                    </Button>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {service.price} ₸
                                        </Typography>
                                        <Button
                                            onClick={() =>
                                                toggleExpand(service.id)
                                            }
                                        >
                                            {expandedServiceId === service.id
                                                ? 'Скрыть'
                                                : 'Подробнее'}
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
            </Box>

            {/* Create Modal */}
            <Modal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                        width: '90%',
                        maxWidth: 400,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Добавить курс
                    </Typography>
                    <TextField
                        fullWidth
                        label="Название"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        error={!!formErrors.title}
                        helperText={formErrors.title}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Описание"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        fullWidth
                        label="Цена"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        error={!!formErrors.price}
                        helperText={formErrors.price}
                        margin="normal"
                        type="number"
                    />
                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!formErrors.category_id}
                    >
                        <InputLabel>Категория</InputLabel>
                        <Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleFormChange}
                            label="Категория"
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.title}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.category_id && (
                            <Typography variant="caption" color="error">
                                {formErrors.category_id}
                            </Typography>
                        )}
                    </FormControl>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleCreateService}
                        >
                            Создать
                        </Button>
                        <Button onClick={() => setOpenCreateModal(false)}>
                            Отмена
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Edit Modal */}
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                        width: '90%',
                        maxWidth: 400,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Редактировать курс
                    </Typography>
                    <TextField
                        fullWidth
                        label="Название"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        error={!!formErrors.title}
                        helperText={formErrors.title}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Описание"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        fullWidth
                        label="Цена"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        error={!!formErrors.price}
                        helperText={formErrors.price}
                        margin="normal"
                        type="number"
                    />
                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!formErrors.category_id}
                    >
                        <InputLabel>Категория</InputLabel>
                        <Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleFormChange}
                            label="Категория"
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.title}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.category_id && (
                            <Typography variant="caption" color="error">
                                {formErrors.category_id}
                            </Typography>
                        )}
                    </FormControl>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleUpdateService}
                        >
                            Сохранить
                        </Button>
                        <Button onClick={() => setOpenEditModal(false)}>
                            Отмена
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                        width: '90%',
                        maxWidth: 400,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Вы точно хотите удалить курс?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteService}
                        >
                            Да
                        </Button>
                        <Button onClick={() => setOpenDeleteModal(false)}>
                            Отмена
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    )
}

export default Services
