// import { useNavigate, useParams } from 'react-router-dom'
// import styles from './Calendar.module.css'
// import { useQuery } from '@tanstack/react-query'
// import { getSlotsExpertById } from '../../api/getExperts'
// import { useState, useMemo } from 'react'
// import { format, parse, isAfter, isSameDay } from 'date-fns'
// import {
//     Box,
//     Grid,
//     Button,
//     CircularProgress,
//     Typography,
//     IconButton,
//     TextField,
// } from '@mui/material'
// import { ArrowBack } from '@mui/icons-material'
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// import ruLocale from 'date-fns/locale/ru'

// const Calendar = () => {
//     const { id } = useParams()
//     const [selectedDate, setSelectedDate] = useState(new Date())
//     const navigate = useNavigate()

//     const { data, isLoading, isError } = useQuery({
//         queryKey: ['getSlotsExpertById', id],
//         queryFn: ({ queryKey }) => getSlotsExpertById(queryKey[1]),
//     })

//     const highlightedDates = useMemo(() => {
//         if (!data) return []
//         const now = new Date()
//         const uniqueDates = new Set()

//         data.forEach((slot) => {
//             const slotDateTime = parse(
//                 `${slot.date} ${slot.time}`,
//                 'yyyy-MM-dd HH:mm:ss',
//                 new Date()
//             )
//             if (isAfter(slotDateTime, now)) {
//                 const slotDate = parse(slot.date, 'yyyy-MM-dd', new Date())
//                 uniqueDates.add(slotDate.toDateString())
//             }
//         })

//         return Array.from(uniqueDates).map((date) => new Date(date))
//     }, [data])

//     const filteredSlots = useMemo(() => {
//         if (!data) return []

//         const now = new Date()
//         return data
//             .filter((slot) => {
//                 const slotDateTime = parse(
//                     `${slot.date} ${slot.time}`,
//                     'yyyy-MM-dd HH:mm:ss',
//                     new Date()
//                 )
//                 return (
//                     isAfter(slotDateTime, now) &&
//                     isSameDay(slotDateTime, selectedDate)
//                 )
//             })
//             .sort((a, b) => {
//                 const timeA = parse(a.time, 'HH:mm:ss', new Date())
//                 const timeB = parse(b.time, 'HH:mm:ss', new Date())
//                 return timeA - timeB
//             })
//     }, [data, selectedDate])

//     const isDateAvailable = (date) =>
//         highlightedDates.some((highlightedDate) =>
//             isSameDay(date, highlightedDate)
//         )

//     const handleGoBack = () => {
//         navigate(-1)
//     }

//     return (
//         <div className={styles.wrapper}>
//             <Box className={styles.items}>
//                 <IconButton
//                     aria-label="back"
//                     size="large"
//                     sx={{ color: 'primary.main', alignSelf: 'flex-start' }}
//                     onClick={handleGoBack}
//                 >
//                     <ArrowBack fontSize="large" />
//                 </IconButton>
//                 <Box className={styles.calendar}>
//                     <Box sx={{ mb: 4 }} className={styles.datapickerwrapper}>
//                         <Typography
//                             variant="h4"
//                             gutterBottom
//                             sx={{ marginTop: '3rem', marginBottom: '2rem' }}
//                         >
//                             График эксперта
//                         </Typography>
//                         <LocalizationProvider
//                             dateAdapter={AdapterDateFns}
//                             adapterLocale={ruLocale}
//                         >
//                             <DatePicker
//                                 label="Выберите дату"
//                                 value={selectedDate}
//                                 onChange={(date) => setSelectedDate(date)}
//                                 disablePast
//                                 shouldDisableDate={(date) =>
//                                     !isDateAvailable(date)
//                                 }
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         fullWidth
//                                         className={styles.datePicker}
//                                     />
//                                 )}
//                             />
//                         </LocalizationProvider>
//                     </Box>

//                     {isLoading && <CircularProgress />}
//                     {isError && (
//                         <Typography color="error" sx={{ fontSize: '1.4rem' }}>
//                             Ошибка загрузки слотов
//                         </Typography>
//                     )}

//                     <Box className={styles.slotsWrapper}>
//                         {filteredSlots.length > 0 ? (
//                             filteredSlots.map((slot) => (
//                                 <Box key={`${slot.date}-${slot.time}`}>
//                                     <Button
//                                         variant="contained"
//                                         fullWidth
//                                         sx={{ py: 1.5, fontSize: '1.2rem' }}
//                                     >
//                                         {format(
//                                             parse(
//                                                 slot.time,
//                                                 'HH:mm:ss',
//                                                 new Date()
//                                             ),
//                                             'HH:mm'
//                                         )}
//                                     </Button>
//                                 </Box>
//                             ))
//                         ) : (
//                             <Grid item xs={12}>
//                                 <Typography sx={{ fontSize: '1.4rem' }}>
//                                     Нет доступных слотов на{' '}
//                                     {format(selectedDate, 'dd.MM.yyyy')}
//                                 </Typography>
//                             </Grid>
//                         )}
//                     </Box>
//                 </Box>
//             </Box>
//         </div>
//     )
// }

// export default Calendar

import { useNavigate, useParams } from 'react-router-dom'
import styles from './Calendar.module.css'
import { useQuery } from '@tanstack/react-query'
import { getSlotsExpertById } from '../../api/getExperts'
import { useState, useMemo } from 'react'
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker'
import ruLocale from 'date-fns/locale/ru'
import { apiRequest } from '../../../../utils/api'

const Calendar = () => {
    const { id, date: courseId } = useParams()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState(null)
    const navigate = useNavigate()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getSlotsExpertById', id],
        queryFn: ({ queryKey }) => getSlotsExpertById(queryKey[1]),
    })

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
            if (isAfter(slotDateTime, now)) {
                const slotDate = parse(slot.date, 'yyyy-MM-dd', new Date())
                uniqueDates.add(slotDate.toDateString())
            }
        })

        return Array.from(uniqueDates).map((date) => new Date(date))
    }, [data])

    const filteredSlots = useMemo(() => {
        if (!data) return []

        const now = new Date()
        const uniqueSlots = new Set()
        const slots = data
            .filter((slot) => {
                const slotDateTime = parse(
                    `${slot.date} ${slot.time}`,
                    'yyyy-MM-dd HH:mm:ss',
                    new Date()
                )
                const isValidSlot =
                    isAfter(slotDateTime, now) &&
                    isSameDay(slotDateTime, selectedDate)
                const slotKey = `${slot.date}_${slot.time}`

                // Проверяем, не добавлен ли уже этот слот
                if (isValidSlot && !uniqueSlots.has(slotKey)) {
                    uniqueSlots.add(slotKey)
                    return true
                }
                return false
            })
            .sort((a, b) => {
                const timeA = parse(a.time, 'HH:mm:ss', new Date())
                const timeB = parse(b.time, 'HH:mm:ss', new Date())
                return timeA - timeB
            })

        return slots
    }, [data, selectedDate])

    const handleDateChange = (date) => {
        setSelectedDate(date)
        setSelectedTime(null)
    }

    const handleTimeSelect = (time) => {
        setSelectedTime(time)
    }

    /////запись
    const handleBooking = async () => {
        // Проверка обязательных полей
        if (!selectedTime || !selectedDate) {
            console.log('Не выбраны дата или время')
            return
        }

        // Форматирование данных для отправки
        const bookingData = {
            date: format(selectedDate, 'dd.MM.yyyy'),
            time: format(parse(selectedTime, 'HH:mm:ss', new Date()), 'HH:mm'),
        }

        try {
            const response = await apiRequest({
                method: 'POST',
                url: `/api/services/${courseId}/bookings`,
                data: bookingData,
            })

            if (!response.ok) {
                throw new Error('Ошибка при бронировании')
            }
            alert('Бронирование прошло успешно')
            console.log('Бронирование успешно:', response.data)
            console.log('Отправленные данные:', bookingData)
        } catch (error) {
            console.error('Ошибка:', error.message)
        }
    }

    console.log(courseId)

    return (
        <div className={styles.wrapper}>
            <Box className={styles.items}>
                <IconButton
                    aria-label="back"
                    size="large"
                    sx={{ color: 'primary.main', alignSelf: 'flex-start' }}
                    onClick={() => navigate(-1)}
                >
                    <ArrowBack fontSize="large" />
                </IconButton>
                <Box className={styles.calendar}>
                    <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={ruLocale}
                    >
                        <MUIDatePicker
                            label="Выберите дату"
                            value={selectedDate}
                            onChange={(newDate) => {
                                if (newDate) handleDateChange(newDate)
                            }}
                            minDate={new Date()}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    className: styles.datePicker,
                                },
                            }}
                            shouldDisableDate={(date) =>
                                !highlightedDates.some((highlightedDate) =>
                                    isSameDay(date, highlightedDate)
                                )
                            }
                        />
                    </LocalizationProvider>

                    {isLoading && <CircularProgress />}
                    {isError && (
                        <Typography color="error" sx={{ fontSize: '1.4rem' }}>
                            Ошибка загрузки слотов
                        </Typography>
                    )}

                    <Box className={styles.slotsWrapper}>
                        {filteredSlots.length > 0 ? (
                            filteredSlots.map((slot) => (
                                <Box
                                    key={`${slot.date}_${slot.time}`} // Уникальный ключ
                                    sx={{ mb: 1 }}
                                >
                                    <Button
                                        variant={
                                            selectedTime === slot.time
                                                ? 'contained'
                                                : 'outlined'
                                        }
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            fontSize: '1.2rem',
                                            borderColor:
                                                selectedTime === slot.time
                                                    ? 'primary.main'
                                                    : 'grey.300',
                                            backgroundColor:
                                                selectedTime === slot.time
                                                    ? 'primary.light'
                                                    : 'transparent',
                                        }}
                                        onClick={() =>
                                            handleTimeSelect(slot.time)
                                        }
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

                    {filteredSlots.length > 0 && (
                        <Box
                            sx={{
                                mt: 3,
                                marginTop: 'auto',
                                marginBottom: '3rem',
                            }}
                        >
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={!selectedTime}
                                sx={{ py: 1.5, fontSize: '1.2rem' }}
                                onClick={handleBooking}
                            >
                                Забронировать
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    )
}

export default Calendar
