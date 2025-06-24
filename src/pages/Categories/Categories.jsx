import { useQuery } from '@tanstack/react-query'
import {
    getCategories,
    getReviews,
} from '../../modules/Categories/api/getCategories'
import styles from './Categories.module.css'
import { Link, Outlet, useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import CategoriesSkeleton from '../../modules/Categories/components/CategoriesSkeleton/CategoriesSkeleton'
import { getExpertsSearchByCategory } from '../../modules/Categories/api/getExperts'
import ExpertsList from '../../modules/Categories/components/ExpertsList/ExpertsList'
import ExpertItem from '../../components/ExpertItem/ExpertItem'
import ExpertsListSkeleton from '../../modules/Categories/components/ExpertsListSkeleton/ExpertsListSkeleton'
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Rating,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { useRole } from '../../modules/Categories/utils/hooks/useRole/useRole'
import { apiRequest } from '../../utils/api'
import { hapticFeedback } from '../../utils/hapticFeedBack/hapticFeedBack'

const Categories = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 60,
    })

    const {
        data: reviewData,
        isLoading: reviewLoading,
        isError: reviewError,
        refetch: refetchReviews,
    } = useQuery({
        queryKey: ['reviews'],
        queryFn: getReviews,
    })

    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

    const { role, isLoading: isRoleLoading, isError: isRoleError } = useRole()

    const pendingReviews = reviewData?.pending_reviews || []
    const currentReview = pendingReviews[currentReviewIndex]

    useEffect(() => {
        if (
            pendingReviews.length > 0 &&
            !reviewLoading &&
            !reviewError &&
            currentReview &&
            (currentReview.user_id || currentReview.expert_id)
        ) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [pendingReviews, reviewLoading, reviewError, currentReview])

    const handleSubmit = async () => {
        if (!rating) {
            console.error('Рейтинг не указан')
            return
        }

        try {
            const payload = {
                rating,
                comment: comment.trim() || undefined,
            }

            let endpoint
            let id

            // Выбор ID и эндпоинта на основе данных в currentReview
            if (currentReview.user_id) {
                id = currentReview.user_id
                endpoint = `/api/users/${id}`
            } else if (currentReview.expert_id) {
                id = currentReview.expert_id
                endpoint = `/api/experts/${id}`
            } else {
                console.error(
                    'Идентификатор не найден в currentReview:',
                    currentReview
                )
                return
            }

            await apiRequest({
                url: endpoint,
                method: 'POST',
                data: payload,
            })

            setRating(0)
            setComment('')

            if (currentReviewIndex < pendingReviews.length - 1) {
                setCurrentReviewIndex((prev) => prev + 1)
            } else {
                setOpen(false)
                setCurrentReviewIndex(0)
                await refetchReviews()
            }
        } catch (error) {
            console.error('Ошибка отправки отзыва:', error)
        }
    }

    const handleClose = () => {
        if (currentReviewIndex >= pendingReviews.length - 1) {
            setOpen(false)
            setCurrentReviewIndex(0)
            setRating(0)
            setComment('')
        }
    }

    const sortedCategories = data
        ? [...data].sort((a, b) => a.position - b.position)
        : []

    const { subtitle, id } = useParams()
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [isNotSubtitle, setIsNotSubtitle] = useState(true)

    const [filters, setFilters] = useState({
        rating: '',
        isAFree: false,
    })

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(handler)
    }, [search])

    const {
        data: dataExperts,
        isLoading: isLoadingExperts,
        isError: isErrorExperts,
    } = useQuery({
        queryKey: [
            'expertsSearchByCategory',
            subtitle,
            debouncedSearch,
            filters,
        ],
        queryFn: getExpertsSearchByCategory,
        enabled: !!debouncedSearch || !!filters.rating || !!filters.isAFree,
    })

    const wrapperRef = useRef(null)

    useEffect(() => {
        wrapperRef.current?.scrollTo({ top: 0 })
    }, [subtitle, id])

    if (isLoading)
        return (
            <div className={styles.wrapper} ref={wrapperRef}>
                <div className={styles.items}>
                    <CategoriesSkeleton />
                </div>
            </div>
        )
    if (isError) return <div>Ошибка загрузки категорий</div>

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <Modal
                open={open}
                onClose={() => {
                    hapticFeedback('medium')
                    handleClose()
                }}
                aria-labelledby="modal-title"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h5">
                        Оставьте пожалуйста ваш отзыв
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'grey.400' }} />
                        <Typography variant="h5">
                            {currentReview?.first_name}{' '}
                            {currentReview?.last_name || ''}
                        </Typography>
                    </Box>
                    <Rating
                        name="expert-rating"
                        value={rating}
                        onChange={(event, newValue) => {
                            hapticFeedback('medium')
                            setRating(newValue)
                        }}
                        size="large"
                    />
                    <TextField
                        multiline
                        rows={4}
                        label="Ваш отзыв (до 200 символов)"
                        variant="outlined"
                        value={comment}
                        onChange={(e) => {
                            if (e.target.value.length <= 200) {
                                setComment(e.target.value)
                            }
                        }}
                        fullWidth
                        inputProps={{ maxLength: 200 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {comment.length}/200 символов
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => {
                            hapticFeedback('medium')
                            handleSubmit()
                        }}
                        disabled={!rating}
                    >
                        Отправить
                    </Button>
                </Box>
            </Modal>
            <div className={styles.inputWrapper}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.currentTarget.querySelector('input')?.blur()
                    }}
                >
                    <TextField
                        label="Поиск эксперта"
                        variant="outlined"
                        placeholder="Имя, фамилия, психолог, коуч..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.input}
                        slotProps={{
                            input: {
                                sx: { fontSize: '1.5rem' },
                            },
                            inputLabel: {
                                sx: { fontSize: '1.4rem' },
                            },
                        }}
                    />
                </form>
            </div>

            <div className={styles.filters}>
                <FormControl
                    variant="standard"
                    sx={{
                        m: 1,
                        minWidth: 120,
                    }}
                    className={styles.select}
                >
                    <InputLabel
                        id="demo-simple-select-standard-label"
                        sx={{
                            fontSize: '1.2rem',
                            fontFamily: "'Nunito', sans-serif",
                        }}
                    >
                        Рейтинг
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={filters.rating}
                        onChange={(e) => {
                            hapticFeedback('medium')
                            setFilters((prev) => ({
                                ...prev,
                                rating: e.target.value,
                            }))
                        }}
                        label="Age"
                    >
                        <MenuItem
                            value=""
                            onClick={() => hapticFeedback('medium')}
                        >
                            Любой
                        </MenuItem>
                        <MenuItem
                            value="4.5"
                            onClick={() => hapticFeedback('medium')}
                        >
                            4.5★ и выше
                        </MenuItem>
                        <MenuItem
                            value="4"
                            onClick={() => hapticFeedback('medium')}
                        >
                            4★ и выше
                        </MenuItem>
                        <MenuItem
                            value="3"
                            onClick={() => hapticFeedback('medium')}
                        >
                            3★ и выше
                        </MenuItem>
                    </Select>
                </FormControl>

                <label
                    style={{
                        fontSize: '1.1rem',
                        fontFamily: "'Nunito', sans-serif",
                    }}
                >
                    <Checkbox
                        size="large"
                        checked={filters.isAFree}
                        onChange={(e) => {
                            hapticFeedback('medium')
                            setFilters((prev) => ({
                                ...prev,
                                isAFree: e.target.checked,
                            }))
                        }}
                    />
                    Только бесплатные
                </label>
            </div>

            <div className={styles.items}>
                {!search && !subtitle && !id && (
                    <>
                        {sortedCategories.map((item) => (
                            <Link
                                key={item.id}
                                to={item.subtitle}
                                className={`${styles.item} clickable`}
                                onClick={() => hapticFeedback('medium')}
                            >
                                <h3>{item.title}</h3>
                            </Link>
                        ))}
                    </>
                )}
                {isLoadingExperts && <ExpertsListSkeleton />}
                {dataExperts?.data.map((person) => (
                    <ExpertItem
                        key={person.id}
                        person={person}
                        className={styles.item}
                    />
                ))}
                <Outlet context={{ search: debouncedSearch, filters }} />
            </div>
        </div>
    )
}

export default Categories
