import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    format,
    parse,
    addMinutes,
    isSameDay,
    addMonths,
    isBefore,
    startOfDay,
} from 'date-fns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import styles from './Slots.module.css'
import {
    getAvailableSlots,
    createAvailableSlots,
    deleteAvailableSlot,
} from '../api/expertsApi'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'

const Services = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [slotToDelete, setSlotToDelete] = useState(null)
    const [newSlotTime, setNewSlotTime] = useState(null)
    const [autofillOpen, setAutofillOpen] = useState(false)
    const [autofillStart, setAutofillStart] = useState(null)
    const [autofillEnd, setAutofillEnd] = useState(null)
    const [autofillInterval, setAutofillInterval] = useState(30)
    const [error, setError] = useState(null)
    const [alertVisible, setAlertVisible] = useState(false)

    const queryClient = useQueryClient()

    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            setAlertVisible(true)
            const timer = setTimeout(() => {
                setAlertVisible(false)
                setTimeout(() => setError(null), 500) // Wait for fade-out transition
            }, 3000)
            return () => clearTimeout(timer)
        } else {
            setAlertVisible(false)
        }
    }, [error])

    // Fetch available slots
    const { data: slots = [], isLoading } = useQuery({
        queryKey: ['availableSlots'],
        queryFn: getAvailableSlots,
    })

    // Mutation for creating slots
    const createSlotsMutation = useMutation({
        mutationFn: ({ date, times }) => createAvailableSlots(date, times),
        onSuccess: () => {
            queryClient.invalidateQueries(['availableSlots'])
            setNewSlotTime(null)
            setAutofillOpen(false)
            setAutofillStart(null)
            setAutofillEnd(null)
        },
        onError: (err) => setError('Ошибка при создании слотов'),
    })

    // Mutation for deleting slots
    const deleteSlotMutation = useMutation({
        mutationFn: deleteAvailableSlot,
        onSuccess: () => {
            queryClient.invalidateQueries(['availableSlots'])
            setOpenDeleteModal(false)
            setSlotToDelete(null)
        },
        onError: (err) => setError('Ошибка при удалении слота'),
    })

    // Filter and sort slots for the selected date
    const filteredSlots = slots
        .filter((slot) =>
            isSameDay(parse(slot.date, 'yyyy-MM-dd', new Date()), selectedDate)
        )
        .sort((a, b) => {
            const timeA = parse(a.time, 'HH:mm:ss', new Date())
            const timeB = parse(b.time, 'HH:mm:ss', new Date())
            return timeA - timeB
        })

    // Highlight days with slots in green
    const renderDay = (day, selectedDays, pickersDayProps) => {
        const hasSlots = slots.some((slot) =>
            isSameDay(parse(slot.date, 'yyyy-MM-dd', new Date()), day)
        )
        return (
            <Box
                {...pickersDayProps}
                sx={{
                    ...pickersDayProps.sx,
                    backgroundColor: hasSlots ? '#4caf50' : 'inherit',
                    color: hasSlots ? 'white' : 'inherit',
                    '&:hover': {
                        backgroundColor: hasSlots
                            ? '#388e3c'
                            : 'rgba(0, 0, 0, 0.04)',
                    },
                }}
            />
        )
    }

    // Handle adding a single slot
    const handleAddSlot = () => {
        if (!newSlotTime) {
            setError('Выберите время для слота')
            return
        }
        const now = new Date()
        const isToday = isSameDay(selectedDate, now)
        if (isToday && isBefore(newSlotTime, now)) {
            setError('Нельзя добавить слот в прошлом времени')
            return
        }
        const time = format(newSlotTime, 'HH:mm')
        if (filteredSlots.some((slot) => slot.time.slice(0, 5) === time)) {
            setError('Слот на это время уже существует')
            return
        }
        const date = format(selectedDate, 'dd.MM.yyyy')
        createSlotsMutation.mutate({ date, times: [time] })
    }

    // Handle autofill slots
    const handleAutofill = () => {
        if (!autofillStart || !autofillEnd || autofillStart >= autofillEnd) {
            setError('Выберите корректный диапазон времени')
            return
        }
        const now = new Date()
        const isToday = isSameDay(selectedDate, now)
        if (isToday && isBefore(autofillStart, now)) {
            setError('Начальное время не может быть в прошлом')
            return
        }
        const times = []
        let currentTime = autofillStart
        while (currentTime <= autofillEnd) {
            const time = format(currentTime, 'HH:mm')
            if (!filteredSlots.some((slot) => slot.time.slice(0, 5) === time)) {
                times.push(time)
            }
            currentTime = addMinutes(currentTime, autofillInterval)
        }
        if (times.length === 0) {
            setError('Все слоты в этом диапазоне уже существуют')
            return
        }
        const date = format(selectedDate, 'dd.MM.yyyy')
        createSlotsMutation.mutate({ date, times })
    }

    // Handle delete slot confirmation
    const handleDeleteSlot = () => {
        if (slotToDelete) {
            deleteSlotMutation.mutate(slotToDelete.id)
        }
    }

    const handleTimePickerKeyDown = (event, setTime) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            setTime(null)
        }
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className={styles.wrapper}>
                <IconButton
                    aria-label="back"
                    size="large"
                    sx={{ color: 'primary.main', alignSelf: 'flex-start' }}
                    onClick={() => handleGoBack()}
                >
                    <ArrowBack fontSize="large" />
                </IconButton>
                <Box sx={{ position: 'relative', minHeight: '100%' }}>
                    {error && alertVisible && (
                        <Alert
                            severity="error"
                            onClose={() => {
                                setAlertVisible(false)
                                setError(null)
                            }}
                            sx={{
                                position: 'absolute',
                                top: -20,
                                left: 0,
                                right: 0,
                                zIndex: 1100,
                                transition: 'opacity 0.5s ease-out',
                                opacity: alertVisible ? 1 : 0,
                                mx: 2,
                            }}
                        >
                            {error}
                        </Alert>
                    )}
                    <Box
                        className={styles.items}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100%',
                            justifyContent: 'space-between',
                            pt: 2,
                        }}
                    >
                        <Box>
                            <DatePicker
                                label="Выберите дату"
                                value={selectedDate}
                                format="dd/MM/yyyy"
                                onChange={(newValue) =>
                                    setSelectedDate(newValue)
                                }
                                minDate={startOfDay(new Date())}
                                maxDate={addMonths(new Date(), 1)}
                                renderDay={renderDay}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6">
                                Доступные слоты
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    p: 2,
                                    minHeight: '30rem',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    mb: 2,
                                }}
                            >
                                {isLoading ? (
                                    <Typography>Загрузка...</Typography>
                                ) : filteredSlots.length === 0 ? (
                                    <Typography>
                                        Нет слотов на выбранную дату
                                    </Typography>
                                ) : (
                                    <List>
                                        {filteredSlots.map((slot) => (
                                            <ListItem
                                                key={slot.id}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => {
                                                            setSlotToDelete(
                                                                slot
                                                            )
                                                            setOpenDeleteModal(
                                                                true
                                                            )
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1,
                                                    mb: 1,
                                                    px: 2,
                                                }}
                                            >
                                                <ListItemText
                                                    primary={slot.time.slice(
                                                        0,
                                                        5
                                                    )}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                }}
                            >
                                <TimePicker
                                    label="Добавить слот"
                                    value={newSlotTime}
                                    onChange={setNewSlotTime}
                                    ampm={false}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth />
                                    )}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddSlot}
                                    startIcon={<AddIcon />}
                                    sx={{ flexShrink: 0 }}
                                >
                                    Добавить
                                </Button>
                            </Box>
                            <Button
                                variant="outlined"
                                onClick={() => setAutofillOpen(true)}
                                startIcon={<AutorenewIcon />}
                                sx={{ width: '100%' }}
                            >
                                Автозаполнение
                            </Button>
                        </Box>
                    </Box>
                </Box>

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
                            borderRadius: 1,
                            minWidth: 300,
                        }}
                    >
                        <Typography variant="h6">
                            Вы точно хотите удалить слот?
                        </Typography>
                        <Typography>
                            {slotToDelete &&
                                `${slotToDelete.date} ${slotToDelete.time.slice(0, 5)}`}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteSlot}
                            >
                                Удалить
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setOpenDeleteModal(false)}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                <Modal
                    open={autofillOpen}
                    onClose={() => setAutofillOpen(false)}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            p: 4,
                            borderRadius: 1,
                            minWidth: 300,
                        }}
                    >
                        <Typography variant="h6">
                            Автозаполнение слотов
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <TimePicker
                                label="Начальное время"
                                value={autofillStart}
                                onChange={setAutofillStart}
                                ampm={false}
                                clearable
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                                onKeyDown={(e) =>
                                    handleTimePickerKeyDown(e, setAutofillStart)
                                }
                            />
                            <TimePicker
                                label="Конечное время"
                                value={autofillEnd}
                                onChange={setAutofillEnd}
                                ampm={false}
                                clearable
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                                onKeyDown={(e) =>
                                    handleTimePickerKeyDown(e, setAutofillEnd)
                                }
                            />
                            <FormControl fullWidth>
                                <InputLabel>Интервал</InputLabel>
                                <Select
                                    value={autofillInterval}
                                    onChange={(e) =>
                                        setAutofillInterval(e.target.value)
                                    }
                                    label="Интервал"
                                >
                                    <MenuItem value={15}>15 минут</MenuItem>
                                    <MenuItem value={30}>30 минут</MenuItem>
                                    <MenuItem value={60}>1 час</MenuItem>
                                    <MenuItem value={90}>1.5 часа</MenuItem>
                                </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleAutofill}
                                >
                                    Создать
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setAutofillOpen(false)}
                                >
                                    Отмена
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </LocalizationProvider>
    )
}

export default Services
