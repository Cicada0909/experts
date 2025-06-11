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
} from '@mui/material'
import styles from './Applications.module.css'

const Applications = () => {
    const { role, isLoading: isRoleLoading, isError: isRoleError } = useRole()
    const [activeTab, setActiveTab] = useState('future')
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchBookings = async () => {
        setLoading(true)
        setError(null)
        try {
            let data = []
            // For admin and user roles, fetch user bookings
            if (role === 'user' || role === 'admin') {
                if (activeTab === 'future') {
                    data = await getUserFutureBookings()
                } else {
                    data = await getUserCompletedBookings()
                }
            } else if (role === 'expert') {
                if (activeTab === 'future') {
                    data = await getExpertFutureBookings()
                } else {
                    data = await getExpertCompletedBookings()
                }
            }

            // Normalize data for consistent rendering
            const normalizedBookings = data.map((booking) => ({
                service_title: booking.service_title || 'N/A', // Default for expert role
                date: booking.date,
                time: booking.time,
                expert_first_name: booking.expert_first_name || 'N/A', // Default for expert role
                expert_last_name: booking.expert_last_name || '',
                expert_phone:
                    booking.expert_phone || booking.user_phone || 'N/A',
                expert_photo:
                    booking.expert_photo ||
                    'https://randomuser.me/api/portraits/lego/1.jpg', // Fallback image
                expert_rating:
                    booking.expert_rating || booking.user_rating || 0,
                date_of_purchase: booking.date_of_purchase,
            }))

            // Sort bookings
            normalizedBookings.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`)
                const dateB = new Date(`${b.date}T${b.time}`)
                return activeTab === 'future' ? dateA - dateB : dateB - dateA
            })

            setBookings(normalizedBookings)
        } catch (err) {
            setError('Не удалось загрузить записи')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (role) {
            fetchBookings()
        }
    }, [role, activeTab])

    if (isRoleLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        )
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
        <Box className={styles.wrapper} p={3}>
            <Box mb={3}>
                <Button
                    variant={activeTab === 'future' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('future')}
                    sx={{ mr: 1 }}
                >
                    Предстоящие записи
                </Button>
                <Button
                    variant={
                        activeTab === 'completed' ? 'contained' : 'outlined'
                    }
                    onClick={() => setActiveTab('completed')}
                >
                    История
                </Button>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Box mb={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {!loading && !error && bookings.length === 0 && (
                <Typography variant="h6" align="center">
                    Нет доступных записей
                </Typography>
            )}

            <Box
                className={styles.items}
                display="flex"
                flexDirection="column"
                gap={2}
            >
                {bookings.map((booking, index) => (
                    <Card key={index} sx={{ maxWidth: 600 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar
                                    src={booking.expert_photo}
                                    alt={`${booking.expert_first_name} ${booking.expert_last_name}`}
                                    sx={{ width: 56, height: 56, mr: 2 }}
                                />
                                <Box flexGrow={1}>
                                    <Typography variant="h6">
                                        {booking.expert_first_name}{' '}
                                        {booking.expert_last_name}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
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
                                        variant="h6"
                                        gutterBottom
                                        sx={{ fontSize: '1rem' }}
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
                                justifyContent="flex-end"
                                mt={2}
                            >
                                <Rating
                                    value={booking.expert_rating}
                                    readOnly
                                />
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    )
}

export default Applications
