import { useNavigate, useParams } from 'react-router-dom'
import styles from './Calendar.module.css'
import { useQuery } from '@tanstack/react-query'
import { getSlotsExpertById } from '../../api/getExperts'
import { useState, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format, parse, isAfter, isSameDay } from 'date-fns'
import {
    Box,
    Grid,
    Button,
    CircularProgress,
    Typography,
    IconButton,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const Calendar = () => {
    const { id } = useParams()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const navigate = useNavigate()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getSlotsExpertById', id],
        queryFn: ({ queryKey }) => getSlotsExpertById(queryKey[1]),
    })

    console.log(data)

    const highlightedDates = useMemo(() => {
        if (!data) return []
        const now = new Date()
        const uniqueDates = new Set()

        data.forEach((slot) => {
            const slotDateTime = parse(
                `${slot.date} ${slot.time}`,
                'yyyy-MM-dd HH:mm:ss',
                new Date()
            )
            // Only include slots that are in the future
            if (isAfter(slotDateTime, now)) {
                const slotDate = parse(slot.date, 'yyyy-MM-dd', new Date())
                uniqueDates.add(slotDate.toDateString())
            }
        })

        return Array.from(uniqueDates).map((date) => new Date(date))
    }, [data])

    const handleGoBack = () => {
        navigate(-1)
    }

    const filteredSlots = useMemo(() => {
        if (!data) return []

        const now = new Date()
        return data
            .filter((slot) => {
                const slotDateTime = parse(
                    `${slot.date} ${slot.time}`,
                    'yyyy-MM-dd HH:mm:ss',
                    new Date()
                )
                return (
                    isAfter(slotDateTime, now) &&
                    isSameDay(slotDateTime, selectedDate)
                )
            })
            .sort((a, b) => {
                const timeA = parse(a.time, 'HH:mm:ss', new Date())
                const timeB = parse(b.time, 'HH:mm:ss', new Date())
                return timeA - timeB
            })
    }, [data, selectedDate])

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    return (
        <div className={styles.wrapper}>
            <Box className={styles.items}>
                <IconButton
                    aria-label="back"
                    size="large"
                    sx={{ color: 'primary.main', alignSelf: 'flex-start' }}
                    onClick={() => handleGoBack()}
                >
                    <ArrowBack fontSize="large" />
                </IconButton>
                <Box className={styles.calendar}>
                    <Box sx={{ mb: 4 }} className={styles.datapickerwrapper}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ marginTop: '3rem', marginBottom: '2rem' }}
                        >
                            График эксперта
                        </Typography>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd.MM.yyyy"
                            minDate={new Date()}
                            highlightDates={highlightedDates}
                            className={styles.datePicker}
                            wrapperClassName={styles.datePickerWrapper}
                            calendarClassName={styles.largeCalendar}
                            dayClassName={(date) =>
                                highlightedDates.some((highlightedDate) =>
                                    isSameDay(date, highlightedDate)
                                )
                                    ? styles.highlightedDay
                                    : undefined
                            }
                        />
                    </Box>

                    {isLoading && <CircularProgress />}
                    {isError && (
                        <Typography color="error" sx={{ fontSize: '1.4rem' }}>
                            Ошибка загрузки слотов
                        </Typography>
                    )}

                    <Box className={styles.slotsWrapper}>
                        {filteredSlots.length > 0 ? (
                            filteredSlots.map((slot) => (
                                <Box>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ py: 1.5, fontSize: '1.2rem' }}
                                    >
                                        {format(
                                            parse(
                                                slot.time,
                                                'HH:mm:ss',
                                                new Date()
                                            ),
                                            'HH:mm'
                                        )}
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography sx={{ fontSize: '1.4rem' }}>
                                    Нет доступных слотов на{' '}
                                    {format(selectedDate, 'dd.MM.yyyy')}
                                </Typography>
                            </Grid>
                        )}
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default Calendar
