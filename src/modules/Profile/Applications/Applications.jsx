import { useState, useEffect } from 'react'
import { useRole } from '../../Categories/utils/hooks/useRole/useRole'
import {
    getExpertCompletedBookings,
    getExpertFutureBookings,
    getUserCompletedBookings,
    getUserFutureBookings,
} from '../api/expertsApi'
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Avatar,
    Rating,
    CircularProgress,
    Alert,
    IconButton,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material'
import styles from './Applications.module.css'
import { useNavigate } from 'react-router-dom'
import { ArrowBack, Close } from '@mui/icons-material'
import { getUserById } from '../api/userApi'

const Applications = () => {
    const { role, isLoading: isRoleLoading, isError: isRoleError } = useRole()
    const [activeTab, setActiveTab] = useState('future')
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [openReviewsModal, setOpenReviewsModal] = useState(false)
    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(false)
    const [reviewsError, setReviewsError] = useState(null)
    const navigate = useNavigate()

    const fetchBookings = async (tab) => {
        setLoading(true)
        setError(null)
        try {
            let data = []
            if (role === 'user' || role === 'admin') {
                data =
                    tab === 'future'
                        ? await getUserFutureBookings()
                        : await getUserCompletedBookings()
            } else if (role === 'expert') {
                data =
                    tab === 'future'
                        ? await getExpertFutureBookings()
                        : await getExpertCompletedBookings()
            }

            const normalizedBookings = data.map((booking) => ({
                id:
                    booking.id ||
                    `${booking.date}-${booking.time}-${booking.expert_phone}`,
                service_title: booking.service_title || 'N/A',
                date: booking.date,
                time: booking.time,
                expert_first_name: booking.expert_first_name || 'N/A',
                expert_last_name: booking.expert_last_name || '',
                expert_phone:
                    booking.expert_phone || booking.user_phone || 'N/A',
                expert_photo:
                    booking.expert_photo ||
                    'https://randomuser.me/api/portraits/lego/1.jpg',
                expert_rating:
                    booking.expert_rating || booking.user_rating || 0,
                date_of_purchase: booking.date_of_purchase,
                user_id: booking.user_id, // Assuming user_id is available in booking data
            }))

            normalizedBookings.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`)
                const dateB = new Date(`${b.date}T${b.time}`)
                return tab === 'future' ? dateA - dateB : dateB - dateA
            })

            setBookings(normalizedBookings)
        } catch (err) {
            setError('Не удалось загрузить записи')
        } finally {
            setLoading(false)
        }
    }

    const fetchReviews = async (userId) => {
        setReviewsLoading(true)
        setReviewsError(null)
        try {
            const response = await getUserById(userId)
            const sortedReviews = response.reviews.data.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )
            setReviews(sortedReviews)
        } catch (err) {
            setReviewsError('Не удалось загрузить отзывы')
        } finally {
            setReviewsLoading(false)
        }
    }

    const handleOpenReviewsModal = (userId) => {
        fetchReviews(userId)
        setOpenReviewsModal(true)
    }

    const handleCloseReviewsModal = () => {
        setOpenReviewsModal(false)
        setReviews([])
        setReviewsError(null)
    }

    useEffect(() => {
        if (role) {
            fetchBookings(activeTab)
        }
    }, [role, activeTab])

    const handleTabSwitch = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab)
        }
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    if (isRoleError) {
        return (
            <Box m={2}>
                <Alert severity="error">
                    Ошибка при загрузке роли пользователя
                </Alert>
            </Box>
        )
    }

    return (
        <>
            <Box className={styles.wrapper} p={3}>
                <IconButton
                    aria-label="back"
                    size="large"
                    sx={{
                        color: 'primary.main',
                        alignSelf: 'flex-start',
                        marginBottom: '1rem',
                    }}
                    onClick={handleGoBack}
                >
                    <ArrowBack fontSize="large" />
                </IconButton>

                <Box mb={3}>
                    <Button
                        variant={
                            activeTab === 'future' ? 'contained' : 'outlined'
                        }
                        onClick={() => handleTabSwitch('future')}
                        sx={{ mr: 1 }}
                    >
                        Предстоящие записи
                    </Button>
                    <Button
                        variant={
                            activeTab === 'completed' ? 'contained' : 'outlined'
                        }
                        onClick={() => handleTabSwitch('completed')}
                    >
                        История
                    </Button>
                </Box>

                {loading && (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && error && (
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <Typography variant="h6" align="center">
                        Нет доступных записей
                    </Typography>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <Box
                        className={styles.items}
                        display="flex"
                        flexDirection="column"
                        gap={2}
                    >
                        {bookings.map((booking, index) => (
                            <Card
                                key={`${activeTab}-${booking.id}-${index}`}
                                sx={{ maxWidth: 600 }}
                            >
                                <CardContent>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        mb={2}
                                    >
                                        <Avatar
                                            src={booking.expert_photo}
                                            alt={`${booking.expert_first_name} ${booking.expert_last_name}`}
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                mr: 2,
                                            }}
                                        />
                                        <Box flexGrow={1}>
                                            <Typography variant="h6">
                                                {booking.expert_first_name}{' '}
                                                {booking.expert_last_name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                    >
                                        <Box>
                                            <Typography
                                                variant="body1"
                                                color="text.secondary"
                                            >
                                                Дата: {booking.date}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                color="text.secondary"
                                            >
                                                Время: {booking.time}
                                            </Typography>
                                            {booking.date_of_purchase && (
                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                >
                                                    Дата покупки:{' '}
                                                    {new Date(
                                                        booking.date_of_purchase
                                                    ).toLocaleDateString()}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box textAlign="right">
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                            >
                                                {booking.service_title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Телефон: {booking.expert_phone}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Имя: {booking.expert_first_name}{' '}
                                                {booking.expert_last_name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mt={2}
                                    >
                                        <Rating
                                            value={booking.expert_rating}
                                            readOnly
                                        />
                                        {role === 'expert' &&
                                            activeTab === 'future' && (
                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handleOpenReviewsModal(
                                                            booking.user_id
                                                        )
                                                    }
                                                >
                                                    Отзывы
                                                </Button>
                                            )}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>

            <Dialog
                open={openReviewsModal}
                onClose={handleCloseReviewsModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { maxHeight: '80vh', borderRadius: 2 },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    Отзывы
                    <IconButton onClick={handleCloseReviewsModal}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ overflowY: 'auto' }}>
                    {reviewsLoading && (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress />
                        </Box>
                    )}
                    {reviewsError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {reviewsError}
                        </Alert>
                    )}
                    {!reviewsLoading &&
                        !reviewsError &&
                        reviews.length === 0 && (
                            <Typography variant="body1" align="center">
                                Нет отзывов
                            </Typography>
                        )}
                    {!reviewsLoading && !reviewsError && reviews.length > 0 && (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {reviews.map((review) => (
                                <Box key={review.id}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        mb={1}
                                    >
                                        <Rating
                                            value={review.rating}
                                            readOnly
                                            size="small"
                                        />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {new Date(
                                                review.created_at
                                            ).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ textAlign: 'center' }}
                                    >
                                        {review.comment}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Applications
