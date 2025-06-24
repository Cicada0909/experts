import styles from './Search.module.css'
import {
    downloadApplications,
    downloadExpertsExcel,
    downloadStatiscs,
    downloadUsers,
} from '../../utils/apiAdmin/apiAdmin.js'
import {
    Box,
    Button,
    Tab,
    Tabs,
    Modal,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories } from '../../modules/Categories/api/getCategories'
import { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api.js'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'

// Hardcoded password
const CORRECT_PASSWORD = '281998'

// Add category function
const addCategory = async (categoryData) => {
    return apiRequest({
        method: 'POST',
        url: '/api/categories',
        data: categoryData,
    })
}

// Delete category function
const deleteCategory = async (categoryId) => {
    return apiRequest({
        method: 'DELETE',
        url: `/api/categories/${categoryId}`,
    })
}

const Search = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [tabIndex, setTabIndex] = useState(1)
    const [openAddModal, setOpenAddModal] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [newCategory, setNewCategory] = useState({
        title: '',
        subtitle: '',
        description: '',
        position: '',
    })
    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    const [error, setError] = useState('')

    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        enabled: isAuthenticated,
    })

    useEffect(() => {
        const storedAuth = sessionStorage.getItem('isAuthenticated')
        if (storedAuth === 'true') {
            setIsAuthenticated(true)
        }
    }, [])

    const addCategoryMutation = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories'])
            setOpenAddModal(false)
            setNewCategory({
                title: '',
                subtitle: '',
                description: '',
                position: '',
            })
        },
        onError: (error) => {
            console.error('Error adding category:', error)
        },
    })

    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories'])
            setOpenDeleteDialog(false)
            setCategoryToDelete(null)
        },
        onError: (error) => {
            console.error('Error deleting category:', error)
        },
    })

    const handleDownloadExpert = async () => {
        try {
            await downloadExpertsExcel()
            console.log('Файл успешно скачан')
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error)
        }
    }

    const handleDownloadUsers = async () => {
        try {
            await downloadUsers()
            console.log('Файл успешно скачан')
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error)
        }
    }

    const handleDownloadStatiscs = async () => {
        try {
            await downloadStatiscs()
            console.log('Файл успешно скачан')
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error)
        }
    }

    const HandleDownloadApplications = async () => {
        try {
            await downloadApplications()
            console.log('Файл успешно скачан')
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error)
        }
    }

    const handleChange = (event, newValue) => {
        setTabIndex(newValue)
    }

    const handleOpenAddModal = () => {
        setOpenAddModal(true)
    }

    const handleCloseAddModal = () => {
        setOpenAddModal(false)
        setNewCategory({
            title: '',
            subtitle: '',
            description: '',
            position: '',
        })
    }

    const handleAddCategory = () => {
        addCategoryMutation.mutate({
            title: newCategory.title,
            subtitle: newCategory.subtitle,
            description: newCategory.description || null,
            position: newCategory.position
                ? parseInt(newCategory.position)
                : null,
        })
    }

    const handleOpenDeleteDialog = (categoryId) => {
        setCategoryToDelete(categoryId)
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
        setCategoryToDelete(null)
    }

    const handleDeleteCategory = () => {
        if (categoryToDelete) {
            deleteCategoryMutation.mutate(categoryToDelete)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewCategory((prev) => ({ ...prev, [name]: value }))
    }

    const handleBack = () => {
        navigate(-1)
    }

    const handlePasswordSubmit = () => {
        if (password === CORRECT_PASSWORD) {
            sessionStorage.setItem('isAuthenticated', 'true')
            setIsAuthenticated(true)
            setError('')
            setPassword('')
        } else {
            setError('Неверный пароль')
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated')
        setIsAuthenticated(false)
    }

    const sortedCategories = data
        ? [...data].sort((a, b) => a.position - b.position)
        : []

    if (!isAuthenticated) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    gap: 2,
                    p: 2,
                }}
            >
                <Typography variant="h5">Введите пароль</Typography>
                <TextField
                    label="Пароль"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error}
                    helperText={error}
                    sx={{ width: '100%', maxWidth: 400 }}
                />
                <Button
                    variant="contained"
                    onClick={handlePasswordSubmit}
                    disabled={!password}
                    sx={{ width: '100%', maxWidth: 400 }}
                >
                    Войти
                </Button>
            </Box>
        )
    }

    return (
        <div className={styles.wrapper}>
            {/* Back Button and Logout Button */}
            {/* <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button variant="outlined" onClick={handleLogout}>
                    Выйти
                </Button>
            </Box> */}

            <Tabs value={tabIndex} onChange={handleChange} centered>
                <Tab label="Статистика" />
                <Tab label="Категории" />
            </Tabs>

            {tabIndex === 0 && (
                <Box className={styles.items} mt={2}>
                    <Button
                        onClick={handleDownloadExpert}
                        variant="contained"
                        className={styles.btns}
                    >
                        Список экспертов
                    </Button>
                    <Button
                        onClick={handleDownloadUsers}
                        variant="contained"
                        className={styles.btns}
                    >
                        Список пользователей
                    </Button>
                    <Button
                        onClick={handleDownloadStatiscs}
                        variant="contained"
                        className={styles.btns}
                    >
                        Статистика
                    </Button>
                    <Button
                        onClick={HandleDownloadApplications}
                        variant="contained"
                        className={styles.btns}
                    >
                        Отмененные заявки
                    </Button>
                </Box>
            )}

            {tabIndex === 1 && (
                <Box className={styles.items} mt={2}>
                    <Button
                        onClick={handleOpenAddModal}
                        variant="contained"
                        className={styles.btns}
                    >
                        Добавить категорию
                    </Button>
                    {sortedCategories.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.item} clickable`}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <h3 style={{ marginRight: '1rem' }}>
                                    {item.position}
                                </h3>
                                <h3>{item.title}</h3>
                            </div>
                            <IconButton
                                onClick={() => handleOpenDeleteDialog(item.id)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    ))}
                </Box>
            )}

            <Modal
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="modal-modal-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'white',
                        padding: 4,
                        borderRadius: 2,
                        width: 400,
                        maxWidth: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Добавить новую категорию
                    </Typography>
                    <TextField
                        label="Название"
                        name="title"
                        value={newCategory.title}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Название на английском"
                        name="subtitle"
                        value={newCategory.subtitle}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Описание"
                        name="description"
                        value={newCategory.description}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <TextField
                        label="Позиция"
                        name="position"
                        value={newCategory.position}
                        onChange={handleInputChange}
                        type="number"
                        fullWidth
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button
                            onClick={handleCloseAddModal}
                            variant="outlined"
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleAddCategory}
                            variant="contained"
                            disabled={
                                !newCategory.title || !newCategory.subtitle
                            }
                        >
                            Добавить
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы уверены, что хотите удалить эту категорию?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Нет</Button>
                    <Button onClick={handleDeleteCategory} autoFocus>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Search
