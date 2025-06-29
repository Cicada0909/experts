import React, { useState, useEffect } from 'react'
import styles from './Profile.module.css'
import {
    Button,
    Rating,
    Modal,
    Box,
    Input,
    InputAdornment,
    TextField,
    Typography,
    ButtonBase,
    Avatar,
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRole } from '../../modules/Categories/utils/hooks/useRole/useRole'
import { pageRoutes } from '../../constants/pageRoutes'
import { getExpert } from '../../modules/Profile/api/expertsApi'
import { apiRequest } from '../../utils/api'
import { hapticFeedback } from '../../utils/hapticFeedBack/hapticFeedBack'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        profession: '',
        biography: '',
        education: '',
        experience: '',
    })
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarSrc, setAvatarSrc] = useState(undefined)

    const { role, isLoading: isRoleLoading, isError: isRoleError } = useRole()

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['getExpert'],
        queryFn: getExpert,
    })
    console.log(data)

    useEffect(() => {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
        if (tgUser) {
            setUser(tgUser)
        }
    }, [])

    useEffect(() => {
        if (data) {
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                profession: data.profession || '',
                biography: data.biography || '',
                education: data.education || '',
                experience: data.experience || '',
            })
            setAvatarSrc(data.photo || undefined)
        }
    }, [data])

    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => {
        setOpenModal(false)
        setAvatarFile(null)
        setAvatarSrc(data?.photo || undefined)
        setFormData({
            first_name: data?.first_name || '',
            last_name: data?.last_name || '',
            profession: data?.profession || '',
            biography: data?.biography || '',
            education: data?.education || '',
            experience: data?.experience || '',
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            const isValidType = [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/webp',
            ].includes(file.type)
            const isValidSize = file.size <= 8 * 1024 * 1024 // 8 MB

            if (!isValidType) {
                alert('Разрешены только форматы: JPEG, PNG, JPG, WEBP')
                return
            }

            if (!isValidSize) {
                alert('Максимальный размер изображения — 8 МБ')
                return
            }

            setAvatarFile(file)
            const reader = new FileReader()
            reader.onload = () => {
                setAvatarSrc(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const mutation = useMutation({
        mutationFn: async () => {
            const dataToSend = new FormData()
            dataToSend.append('first_name', formData.first_name)
            dataToSend.append('last_name', formData.last_name)
            dataToSend.append('profession', formData.profession)
            dataToSend.append('biography', formData.biography)
            dataToSend.append('experience', formData.experience)
            dataToSend.append('education', formData.education)
            dataToSend.append('_method', 'PATCH')
            if (avatarFile) {
                dataToSend.append('photo', avatarFile)
            }

            return apiRequest({
                method: 'POST',
                url: `/api/experts/${data?.id}`,
                data: dataToSend,
            })
        },
        onSuccess: () => {
            alert('Профиль успешно обновлен!')
            refetch()
            handleCloseModal()
        },
        onError: (error) => {
            alert(
                'Ошибка при обновлении профиля: ' +
                    (error.response?.data?.message || error.message) +
                    'Возможно вы пытались загрузить снимок(сделать снимок), попробуйте загрузить с галерии'
            )
        },
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        const validInputRegex = /^[a-zA-Zа-яА-Я0-9\s,.]+$/
        const onlyDigitsRegex = /^[0-9]+$/

        const errors = []
        if (!formData.first_name) {
            errors.push('Имя')
        } else if (!validInputRegex.test(formData.first_name)) {
            errors.push('Имя содержит недопустимые символы')
        } else if (onlyDigitsRegex.test(formData.first_name)) {
            errors.push('Имя не может состоять только из цифр')
        }

        if (!formData.last_name) {
            errors.push('Фамилия')
        } else if (!validInputRegex.test(formData.last_name)) {
            errors.push('Фамилия содержит недопустимые символы')
        } else if (onlyDigitsRegex.test(formData.last_name)) {
            errors.push('Фамилия не может состоять только из цифр')
        }

        if (!formData.profession) {
            errors.push('Профессия')
        } else if (!validInputRegex.test(formData.profession)) {
            errors.push('Профессия содержит недопустимые символы')
        } else if (onlyDigitsRegex.test(formData.profession)) {
            errors.push('Профессия не может состоять только из цифр')
        }

        if (!formData.biography) {
            errors.push('Биография')
        } else if (!validInputRegex.test(formData.biography)) {
            errors.push('Биография содержит недопустимые символы')
        } else if (onlyDigitsRegex.test(formData.biography)) {
            errors.push('Биография не может состоять только из цифр')
        }

        if (!formData.education) {
            errors.push('Образование')
        } else if (!validInputRegex.test(formData.education)) {
            errors.push('Образование содержит недопустимые символы')
        } else if (onlyDigitsRegex.test(formData.education)) {
            errors.push('Образование не может состоять только из цифр')
        }

        if (!formData.experience) {
            errors.push('Опыт')
        } else if (!validInputRegex.test(formData.experience)) {
            errors.push('Опыт содержит недопустимые символы')
        } else if (onlyDigitsRegex.test(formData.experience)) {
            errors.push('Опыт не может состоять только из цифр')
        }

        if (errors.length > 0) {
            alert(
                `Пожалуйста, заполните корректно следующие поля: ${errors.join(', ')}. Разрешены только буквы, цифры, пробелы, точки и запятые. Поля не могут состоять только из цифр.`
            )
            return
        }

        mutation.mutate()
    }

    return role === 'expert' ? (
        <div className={styles.wrapperExpert}>
            <div className={styles.headerExpert}>
                {data?.photo ? (
                    <div>
                        {isLoading && (
                            <div
                                className={`${styles.avatarSkeleton} ${styles.pulse}`}
                            ></div>
                        )}
                        <img
                            className={styles.avatar}
                            src={data?.photo}
                            alt="User Avatar"
                            onLoad={() => setIsImageLoaded(true)}
                        />
                        <Rating
                            sx={{ paddingTop: '1rem' }}
                            value={data?.rating}
                            readOnly
                        />
                    </div>
                ) : (
                    <div className={styles.avatarSkeleton}></div>
                )}
                <div className={styles.wrapperName}>
                    <h4 className={styles.nameExpert}>
                        {data?.first_name} {data?.last_name}
                    </h4>
                    <h4 className={styles.profesion}>{data?.profession}</h4>
                </div>
            </div>

            <div className={styles.wrapperButtons}>
                <Button
                    component={Link}
                    to={pageRoutes.profileRoutes.services}
                    variant="contained"
                    size="large"
                    className={styles.button}
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '1.4rem',
                        backgroundColor: 'var(--colors__green)',
                    }}
                    onClick={() => hapticFeedback('medium')}
                >
                    Курсы
                </Button>
                {/* <Button
                    component={Link}
                    to={pageRoutes.profileRoutes.slots}
                    variant="contained"
                    size="large"
                    className={styles.button}
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '1.4rem',
                        backgroundColor: 'var(--colors__green)',
                    }}
                    onClick={() => hapticFeedback('medium')}
                >
                    График
                </Button> */}
                <Button
                    component={Link}
                    to={pageRoutes.profileRoutes.applications}
                    variant="contained"
                    size="large"
                    className={styles.button}
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '1.4rem',
                        backgroundColor: 'var(--colors__green)',
                    }}
                    onClick={() => hapticFeedback('medium')}
                >
                    Заявки
                </Button>
            </div>

            <Button
                variant="contained"
                size="large"
                className={styles.button}
                onClick={() => {
                    hapticFeedback('medium')
                    handleOpenModal()
                }}
                sx={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '1.4rem',
                    backgroundColor: 'var(--colors__green)',
                }}
            >
                Редактировать профиль
            </Button>

            <Modal
                open={openModal}
                onClose={() => {
                    hapticFeedback('medium')
                    handleCloseModal()
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit}>
                        <Typography variant="h6" gutterBottom>
                            Редактировать профиль
                        </Typography>
                        <Input
                            sx={{
                                fontSize: '1.6rem',
                                height: '40px',
                                width: '100%',
                                fontFamily: "'Nunito', sans-serif",
                                marginTop: '1rem',
                            }}
                            name="first_name"
                            placeholder="Введите ваше имя"
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            }
                            slotProps={{ htmlInput: { maxLength: 30 } }}
                            onChange={handleInputChange}
                            value={formData.first_name}
                        />
                        <Input
                            sx={{
                                fontSize: '1.6rem',
                                height: '40px',
                                width: '100%',
                                fontFamily: "'Nunito', sans-serif",
                                marginTop: '1rem',
                            }}
                            name="last_name"
                            placeholder="Введите вашу фамилию"
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            }
                            slotProps={{ htmlInput: { maxLength: 30 } }}
                            onChange={handleInputChange}
                            value={formData.last_name}
                        />
                        <TextField
                            sx={{
                                fontSize: '1.6rem',
                                width: '100%',
                                fontFamily: "'Nunito', sans-serif",
                                backgroundColor: '#fefafa',
                                marginTop: '1rem',
                            }}
                            name="profession"
                            label="Профессия"
                            variant="outlined"
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '1.6rem',
                                        fontFamily: "'Nunito', sans-serif",
                                    },
                                },
                                inputLabel: { sx: { fontSize: '1.6rem' } },
                                htmlInput: { maxLength: 50 },
                            }}
                            onChange={handleInputChange}
                            value={formData.profession}
                        />
                        <TextField
                            sx={{
                                fontSize: '1.6rem',
                                width: '100%',
                                fontFamily: "'Nunito', sans-serif",
                                backgroundColor: '#fefafa',
                                marginTop: '1rem',
                            }}
                            multiline
                            name="biography"
                            label="Расскажите о себе"
                            variant="outlined"
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '1.6rem',
                                        fontFamily: "'Nunito', sans-serif",
                                    },
                                },
                                inputLabel: { sx: { fontSize: '1.6rem' } },
                                htmlInput: { maxLength: 400 },
                            }}
                            onChange={handleInputChange}
                            value={formData.biography}
                        />
                        <TextField
                            sx={{
                                fontSize: '1.6rem',
                                width: '100%',
                                fontFamily: "'Nunito', sans-serif",
                                backgroundColor: '#fefafa',
                                marginTop: '1rem',
                            }}
                            name="education"
                            label="Образование"
                            variant="outlined"
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '1.6rem',
                                        fontFamily: "'Nunito', sans-serif",
                                    },
                                },
                                inputLabel: { sx: { fontSize: '1.6rem' } },
                                htmlInput: { maxLength: 50 },
                            }}
                            onChange={handleInputChange}
                            value={formData.education}
                        />
                        <TextField
                            sx={{
                                fontSize: '1.6rem',
                                width: '100%',
                                fontFamily: "'Nunito', sans-serif",
                                backgroundColor: '#fefafa',
                                marginTop: '1rem',
                            }}
                            name="experience"
                            label="Опыт"
                            variant="outlined"
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '1.6rem',
                                        fontFamily: "'Nunito', sans-serif",
                                    },
                                },
                                inputLabel: { sx: { fontSize: '1.6rem' } },
                                htmlInput: { maxLength: 100 },
                            }}
                            onChange={handleInputChange}
                            value={formData.experience}
                        />
                        <ButtonBase
                            component="label"
                            sx={{
                                borderRadius: '40px',
                                display: 'flex',
                                gap: '2rem',
                                marginTop: '2rem',
                                marginBottom: '2rem',
                            }}
                            onClick={() => hapticFeedback('medium')}
                        >
                            <Avatar alt="Upload new avatar" src={avatarSrc} />
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                style={{
                                    border: 0,
                                    clip: 'rect(0 0 0 0)',
                                    height: '1px',
                                    margin: '-1px',
                                    overflow: 'hidden',
                                    padding: 0,
                                    position: 'absolute',
                                    whiteSpace: 'nowrap',
                                    width: '1px',
                                }}
                                onChange={handleAvatarChange}
                            />
                            <Typography
                                variant="h4"
                                sx={{ paddingTop: '0.5rem' }}
                            >
                                Загрузите фото
                            </Typography>
                        </ButtonBase>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    hapticFeedback('medium')
                                    handleCloseModal()
                                }}
                                sx={{
                                    fontFamily: "'Nunito', sans-serif",
                                    fontSize: '1.4rem',
                                }}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    fontFamily: "'Nunito', sans-serif",
                                    fontSize: '1.4rem',
                                    backgroundColor: 'var(--colors__green)',
                                }}
                                disabled={mutation.isLoading}
                                onClick={() => hapticFeedback('medium')}
                            >
                                {mutation.isLoading
                                    ? 'Отправка...'
                                    : 'Сохранить'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    ) : (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                {user?.photo_url ? (
                    <>
                        {!isImageLoaded && (
                            <div
                                className={`${styles.avatarSkeleton} ${styles.pulse}`}
                            ></div>
                        )}
                        <img
                            className={styles.avatar}
                            src={user.photo_url}
                            alt="User Avatar"
                            onLoad={() => setIsImageLoaded(true)}
                            style={{
                                display: isImageLoaded ? 'block' : 'none',
                            }}
                        />
                    </>
                ) : (
                    <div className={styles.avatarSkeleton}></div>
                )}
                <h4 className={styles.name}>
                    {user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.first_name || user?.username || 'Гость'}
                </h4>
            </div>

            {role === 'user' && (
                <>
                    <div className={styles.wrapperButtons}>
                        <Button
                            component={Link}
                            to={pageRoutes.profileRoutes.applications}
                            variant="contained"
                            size="large"
                            className={styles.button}
                            sx={{
                                fontFamily: "'Nunito', sans-serif",
                                fontSize: '1.4rem',
                                backgroundColor: 'var(--colors__green)',
                            }}
                            onClick={() => hapticFeedback('medium')}
                        >
                            Записи
                        </Button>
                    </div>
                    <Button
                        component={Link}
                        to={pageRoutes.profileRoutes.register}
                        variant="contained"
                        size="large"
                        className={styles.button}
                        sx={{
                            fontFamily: "'Nunito', sans-serif",
                            fontSize: '1.4rem',
                            backgroundColor: 'var(--colors__green)',
                        }}
                        onClick={() => hapticFeedback('medium')}
                    >
                        Стать экспертом
                    </Button>
                </>
            )}
            {/* {role === 'admin' && (
                <Button
                    component={Link}
                    to={pageRoutes.profileRoutes.register}
                    variant="contained"
                    size="large"
                    className={styles.button}
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '1.4rem',
                        backgroundColor: 'var(--colors__green)',
                    }}
                    onClick={() => hapticFeedback('medium')}
                >
                    Стать экспертом
                </Button>
            )} */}

            {role === 'admin' && (
                <Button
                    component={Link}
                    to={pageRoutes.profileRoutes.applications}
                    variant="contained"
                    size="large"
                    className={styles.button}
                    sx={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '1.4rem',
                        backgroundColor: 'var(--colors__green)',
                    }}
                    onClick={() => hapticFeedback('medium')}
                >
                    Записи
                </Button>
            )}
        </div>
    )
}

export default Profile
