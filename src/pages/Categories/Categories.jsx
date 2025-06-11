import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../modules/Categories/api/getCategories'
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

const Categories = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 60,
    })

    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleSubmit = () => {
        console.log({ rating, review })
        handleClose()
    }

    const sortedCategories = data
        ? [...data].sort((a, b) => a.position - b.position)
        : []

    const { role, isLoading: isRoleLoading, isError: isRoleError } = useRole()

    console.log(role)

    const { subtitle, id } = useParams()
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [isNotSubtitle, setIsNotSubtitle] = useState(true)

    const [filters, setFilters] = useState({
        rating: '',
        isAFree: false,
    })

    console.log(data)

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

    console.log(dataExperts)

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
            <div className={styles.modalbtn} onClick={handleOpen}></div>
            <Modal
                open={open}
                onClose={handleClose}
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
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'grey.400' }} />
                        <Typography id="modal-title" variant="h6">
                            expert_name
                        </Typography>
                    </Box>
                    <Rating
                        name="expert-rating"
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)}
                        size="large"
                    />
                    <TextField
                        multiline
                        rows={4}
                        label="Ваш отзыв"
                        variant="outlined"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!rating || !review.trim()}
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
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                rating: e.target.value,
                            }))
                        }
                        label="Age"
                    >
                        <MenuItem value="">Любой</MenuItem>
                        <MenuItem value="4.5">4.5★ и выше</MenuItem>
                        <MenuItem value="4">4★ и выше</MenuItem>
                        <MenuItem value="3">3★ и выше</MenuItem>
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
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                isAFree: e.target.checked,
                            }))
                        }
                    ></Checkbox>
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
