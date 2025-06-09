import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    Input,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import styles from './FormRegister.module.css'
import { apiRequest } from '../../../utils/api'

const FormRegister = () => {
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
            const data = new FormData()
            data.append('first_name', formData.first_name)
            data.append('last_name', formData.last_name)
            data.append('profession', formData.profession)
            data.append('biography', formData.biography)
            data.append('experience', formData.experience)
            data.append('education', formData.education)
            if (avatarFile) {
                data.append('photo', avatarFile)
            }

            return apiRequest({
                method: 'POST',
                url: '/api/experts',
                data,
            })
        },
        onSuccess: (response) => {
            alert('Регистрация успешна! Перезайдите в приложение')
            console.log(response.data)
            setFormData({
                first_name: '',
                last_name: '',
                profession: '',
                biography: '',
                education: '',
                experience: '',
            })
            setAvatarFile(null)
            setAvatarSrc(undefined)
        },
        onError: (error) => {
            alert(
                'Ошибка при регистрации: ' +
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

        if (!avatarFile) {
            errors.push('Фото')
        }

        if (errors.length > 0) {
            alert(
                `Пожалуйста, заполните корректно следующие поля: ${errors.join(', ')}. Разрешены только буквы, цифры, пробелы, точки и запятые. Поля не могут состоять только из цифр.`
            )
            return
        }

        mutation.mutate()
    }

    return (
        <div className={styles.wrapper}>
            <Box
                className={styles.items}
                component="form"
                onSubmit={handleSubmit}
            >
                <Box className={styles.inputItems}>
                    <Input
                        sx={{
                            fontSize: '1.6rem',
                            height: '40px',
                            width: '80%',
                            fontFamily: "'Nunito', sans-serif",
                            marginTop: '2rem',
                        }}
                        id="first-name"
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
                            width: '80%',
                            fontFamily: "'Nunito', sans-serif",
                        }}
                        id="last-name"
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
                            width: '80%',
                            fontFamily: "'Nunito', sans-serif",
                            backgroundColor: '#fefafa',
                        }}
                        name="profession"
                        label="Профессия"
                        variant="outlined"
                        className={styles.input}
                        slotProps={{
                            input: {
                                sx: {
                                    fontSize: '1.6rem',
                                    fontFamily: "'Nunito', sans-serif",
                                },
                            },
                            inputLabel: {
                                sx: { fontSize: '1.6rem' },
                            },
                            htmlInput: {
                                maxLength: 50,
                            },
                        }}
                        onChange={handleInputChange}
                        value={formData.profession}
                    />
                    <TextField
                        sx={{
                            fontSize: '1.6rem',
                            width: '80%',
                            fontFamily: "'Nunito', sans-serif",
                            backgroundColor: '#fefafa',
                        }}
                        multiline
                        name="biography"
                        label="Расскажите о себе"
                        variant="outlined"
                        className={styles.input}
                        slotProps={{
                            input: {
                                sx: {
                                    fontSize: '1.6rem',
                                    fontFamily: "'Nunito', sans-serif",
                                },
                            },
                            inputLabel: {
                                sx: { fontSize: '1.6rem' },
                            },
                            htmlInput: {
                                maxLength: 400,
                            },
                        }}
                        onChange={handleInputChange}
                        value={formData.biography}
                    />
                    <TextField
                        sx={{
                            fontSize: '1.6rem',
                            width: '80%',
                            fontFamily: "'Nunito', sans-serif",
                            backgroundColor: '#fefafa',
                        }}
                        name="education"
                        label="Образование"
                        variant="outlined"
                        className={styles.input}
                        slotProps={{
                            input: {
                                sx: {
                                    fontSize: '1.6rem',
                                    fontFamily: "'Nunito', sans-serif",
                                },
                            },
                            inputLabel: {
                                sx: { fontSize: '1.6rem' },
                            },
                            htmlInput: {
                                maxLength: 50,
                            },
                        }}
                        onChange={handleInputChange}
                        value={formData.education}
                    />
                    <TextField
                        sx={{
                            fontSize: '1.6rem',
                            width: '80%',
                            fontFamily: "'Nunito', sans-serif",
                            backgroundColor: '#fefafa',
                        }}
                        name="experience"
                        label="Опыт"
                        variant="outlined"
                        className={styles.input}
                        slotProps={{
                            input: {
                                sx: {
                                    fontSize: '1.6rem',
                                    fontFamily: "'Nunito', sans-serif",
                                },
                            },
                            inputLabel: {
                                sx: { fontSize: '1.6rem' },
                            },
                            htmlInput: {
                                maxLength: 100,
                            },
                        }}
                        onChange={handleInputChange}
                        value={formData.experience}
                    />

                    <ButtonBase
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        aria-label="Avatar image"
                        sx={{
                            borderRadius: '40px',
                            display: 'flex',
                            gap: '2rem',
                            marginBottom: '3rem',
                            marginRight: '1rem',
                            '&:has(:focus-visible)': {
                                outline: '2px solid',
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        <Avatar alt="Upload new avatar" src={avatarSrc} />
                        <input
                            type="file"
                            capture={false}
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
                            gutterBottom
                            sx={{
                                paddingTop: '0.5rem',
                            }}
                        >
                            Загрузите фото
                        </Typography>
                    </ButtonBase>
                </Box>
                <Box
                    className={styles.register}
                    sx={{ paddingBottom: '13rem', width: '100%' }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            fontSize: '1.6rem',
                            height: '40px',
                            width: '80%',
                            fontFamily: "'Nunito', sans-serif",
                        }}
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading
                            ? 'Отправка...'
                            : 'Зарегистрироваться'}
                    </Button>
                </Box>
            </Box>
        </div>
    )
}

export default FormRegister
