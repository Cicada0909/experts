import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
    getExpertById,
    getSlotsExpertById,
} from '../../modules/Categories/api/getExperts'
import { getExpertServicesById } from '../../modules/Categories/api/getExpertsServices'
import { useState } from 'react'
import {
    Box,
    Typography,
    Avatar,
    Tabs,
    Tab,
    Paper,
    Rating,
    Button,
    Modal,
    Fade,
    CircularProgress,
    IconButton,
} from '@mui/material'
import { ArrowBack, CheckCircleOutline } from '@mui/icons-material'
import { useAddFavoriteMutation } from '../../utils/hooks/useAddFavoriteMutation'
import styles from './ExpertDetails.module.css'
import { useRole } from '../../modules/Categories/utils/hooks/useRole/useRole'
import { deleteExpert } from '../../utils/apiAdmin/apiAdmin'

const ExpertDetails = () => {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState(0)
    const [openModal, setOpenModal] = useState(false)
    const mutation = useAddFavoriteMutation()
    const [expandedCourseIds, setExpandedCourseIds] = useState([])
    const navigate = useNavigate()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getExpertById', id],
        queryFn: ({ queryKey }) => getExpertById(queryKey[1]),
    })

    const {
        data: expertServices,
        isLoading: isLoadingExpertServices,
        isError: isErrorExpertServices,
    } = useQuery({
        queryKey: ['expertServices', id],
        queryFn: () => getExpertServicesById(id),
    })

    const { role, isLoading: isRoleLoading, isError: isRoleError } = useRole()

    // Centered loading indicator
    if (isLoading || isLoadingExpertServices) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
                <Typography sx={{ ml: 2, fontFamily: 'Nunito, sans-serif' }}>
                    Загрузка...
                </Typography>
            </Box>
        )
    }

    if (isError || isErrorExpertServices) {
        return <Box>Ошибка загрузки данных эксперта</Box>
    }

    const expert = data.expert
    const reviews = data.reviews.data || []
    const courses = expertServices?.data || []

    const handleAddFavorite = () => {
        mutation.mutate(id)
        setOpenModal(true)
        setTimeout(() => setOpenModal(false), 2000)
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const truncateDescription = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const toggleExpanded = (courseId) => {
        setExpandedCourseIds((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId]
        )
    }

    const handleDelete = async (expertId) => {
        try {
            await deleteExpert(expertId)
            alert('Эксперт успешно удален')
        } catch (error) {
            console.error('Ошибка при удалении:', error)
            alert('Ошибка при удалении')
        }
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.items}>
                <IconButton
                    aria-label="back"
                    size="large"
                    sx={{ color: 'primary.main', alignSelf: 'flex-start' }}
                    onClick={() => handleGoBack()}
                >
                    <ArrowBack fontSize="large" />
                </IconButton>
                <Box className={styles.header}>
                    <Avatar
                        src={expert.photo}
                        alt={`${expert.first_name} ${expert.last_name}`}
                        sx={{ width: 100, height: 100 }}
                        className={styles.avatar}
                    />
                    <Box className={styles.headerInfo}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: 'Nunito, sans-serif',
                                fontSize: '1.7rem',
                            }}
                        >
                            {`${expert.first_name} ${expert.last_name}`}
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{
                                fontFamily: 'Nunito, sans-serif',
                                fontSize: '1.3rem',
                            }}
                        >
                            {expert.profession}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Rating
                                value={expert.rating}
                                precision={0.5}
                                readOnly
                                sx={{ fontSize: '2rem' }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    onClick={handleAddFavorite}
                    disabled={mutation.isLoading}
                    sx={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '1.4rem',
                        mt: 3,
                        mb: 2,
                        maxWidth: '40rem',
                    }}
                >
                    {mutation.isLoading
                        ? 'Добавление...'
                        : 'Добавить в избранное'}
                </Button>

                {role === 'admin' && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(id)}
                        sx={{
                            fontFamily: 'Nunito, sans-serif',
                            fontSize: '1.4rem',
                        }}
                    >
                        Удалить эксперта
                    </Button>
                )}

                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    closeAfterTransition
                >
                    <Fade in={openModal}>
                        <Box className={styles.modal}>
                            <CheckCircleOutline
                                sx={{
                                    color: '#4caf50',
                                    fontSize: '3rem',
                                    mb: 1,
                                }}
                            />
                            <Typography
                                variant="h5"
                                sx={{ fontFamily: 'Nunito, sans-serif' }}
                            >
                                Эксперт {expert.first_name} {expert.last_name}{' '}
                                добавлен в избранное
                            </Typography>
                        </Box>
                    </Fade>
                </Modal>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{ mb: 2 }}
                >
                    <Tab
                        label="Об эксперте"
                        sx={{
                            fontFamily: 'Nunito, sans-serif',
                            fontSize: '1.2rem',
                        }}
                    />
                    <Tab
                        label="Отзывы"
                        sx={{
                            fontFamily: 'Nunito, sans-serif',
                            fontSize: '1.2rem',
                        }}
                    />
                    <Tab
                        label="Курсы"
                        sx={{
                            fontFamily: 'Nunito, sans-serif',
                            fontSize: '1.2rem',
                        }}
                    />
                </Tabs>

                <Paper elevation={3} sx={{ p: 3, minHeight: 200 }}>
                    {activeTab === 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: 'Nunito, sans-serif',
                                    mb: 2,
                                    fontSize: '1.6rem',
                                    fontWeight: '600',
                                }}
                            >
                                Об эксперте
                            </Typography>
                            <Typography
                                variant="body1"
                                component="span"
                                sx={{
                                    fontFamily: 'Nunito, sans-serif',
                                    fontSize: '1.3rem',
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    component="span"
                                    sx={{
                                        fontFamily: 'Nunito, sans-serif',
                                        fontSize: '1.3rem',
                                        marginBottom: '2rem',
                                    }}
                                >
                                    {expert.biography}
                                </Typography>
                                <div style={{ visibility: 'hidden' }}>
                                    proffesion
                                </div>
                                <strong>Профессия:</strong> {expert.profession}
                            </Typography>
                            <Typography
                                variant="body1"
                                component="span"
                                sx={{
                                    fontFamily: 'Nunito, sans-serif',
                                    fontSize: '1.3rem',
                                }}
                            >
                                <strong>Опыт:</strong> {expert.experience}
                            </Typography>
                            <Typography
                                variant="body1"
                                component="span"
                                sx={{
                                    fontFamily: 'Nunito, sans-serif',
                                    fontSize: '1.3rem',
                                }}
                            >
                                <strong>Образование:</strong> {expert.education}
                            </Typography>
                        </Box>
                    )}

                    {activeTab === 1 && (
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: 'Nunito, sans-serif',
                                    mb: 2,
                                    fontSize: '1.6rem',
                                    fontWeight: '600',
                                }}
                            >
                                Отзывы
                            </Typography>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <Box
                                        key={review.id}
                                        sx={{
                                            mb: 3,
                                            p: 2,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontFamily:
                                                        'Nunito, sans-serif',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                {review.user.first_name}{' '}
                                                {review.user.last_name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    fontFamily:
                                                        'Nunito, sans-serif',
                                                    fontSize: '1rem',
                                                }}
                                            >
                                                {formatDate(review.created_at)}
                                            </Typography>
                                        </Box>
                                        <Rating
                                            value={review.rating}
                                            readOnly
                                            sx={{ mb: 1 }}
                                        />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontFamily:
                                                    'Nunito, sans-serif',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            {review.comment}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: 'Nunito, sans-serif',
                                        fontSize: '1.3rem',
                                    }}
                                >
                                    Отзывы отсутствуют.
                                </Typography>
                            )}
                        </Box>
                    )}
                    {activeTab === 2 && (
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: 'Nunito, sans-serif',
                                    mb: 2,
                                    fontSize: '1.6rem',
                                    fontWeight: '600',
                                }}
                            >
                                Курсы эксперта
                            </Typography>
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <Box
                                        key={course.id}
                                        sx={{
                                            mb: 3,
                                            p: 2,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            position: 'relative',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontFamily:
                                                    'Nunito, sans-serif',
                                                fontSize: '1.1rem',
                                                fontWeight: '500',
                                                position: 'absolute',
                                                right: '0.7rem',
                                                color: 'gray',
                                                top: '0.5rem',
                                            }}
                                        >
                                            {course.price === 0
                                                ? 'Бесплатно'
                                                : `${course.price} ₸`}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontFamily:
                                                    'Nunito, sans-serif',
                                                fontSize: '1.6rem',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {course.title}
                                        </Typography>

                                        {expandedCourseIds.includes(
                                            course.id
                                        ) && (
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontFamily:
                                                        'Nunito, sans-serif',
                                                    mb: 1,
                                                    fontSize: '1.3rem',
                                                    marginTop: '1rem',
                                                }}
                                            >
                                                {course.description}
                                            </Typography>
                                        )}

                                        <Link to={`/expert/${id}/${course.id}`}>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    fontFamily:
                                                        'Nunito, sans-serif',
                                                    fontSize: '1.3rem',
                                                    marginTop: '1rem',
                                                }}
                                            >
                                                Записаться
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                toggleExpanded(course.id)
                                            } // Pass the course ID
                                            sx={{
                                                fontFamily:
                                                    'Nunito, sans-serif',
                                                fontSize: '1.3rem',
                                                marginLeft: '1rem',
                                                marginTop: '1rem',
                                            }}
                                        >
                                            {expandedCourseIds.includes(
                                                course.id
                                            )
                                                ? 'Скрыть'
                                                : 'Подробнее'}
                                        </Button>
                                    </Box>
                                ))
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: 'Nunito, sans-serif',
                                        fontSize: '1.3rem',
                                    }}
                                >
                                    Курсы отсутствуют.
                                </Typography>
                            )}
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    )
}

export default ExpertDetails
