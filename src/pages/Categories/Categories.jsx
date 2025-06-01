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

const Categories = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 60,
    })

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
            <div className={styles.inputWrapper}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Поиск по категориям"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={styles.filters}>
                <label>
                    Рейтинг:
                    <select
                        value={filters.rating}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                rating: e.target.value,
                            }))
                        }
                    >
                        <option value="">Любой</option>
                        <option value="4.5">4.5★ и выше</option>
                        <option value="4">4★ и выше</option>
                        <option value="3">3★ и выше</option>
                    </select>
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={filters.isAFree}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                isAFree: e.target.checked,
                            }))
                        }
                    />
                    Только бесплатные
                </label>
            </div>

            <div className={styles.items}>
                {!search && !subtitle && !id && (
                    <>
                        {data.map((item) => (
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
