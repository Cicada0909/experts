import { useParams, useOutletContext } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import ExpertItem from '../../../../components/ExpertItem/ExpertItem'
import styles from './ExpertsList.module.css'
import ExpertsListSkeleton from '../ExpertsListSkeleton/ExpertsListSkeleton'
import { getExpertsSearchByCategory } from '../../api/getExperts'

const ExpertsList = () => {
    const { subtitle } = useParams()
    const { search, filters } = useOutletContext()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['expertsSearchByCategory', subtitle, search, filters],
        queryFn: getExpertsSearchByCategory,
    })

    if (isLoading) return <ExpertsListSkeleton />
    if (isError) return <p>Ошибка при загрузке экспертов</p>

    return (
        <div className={styles.wrapper}>
            <div className={styles.items}>
                {/* {data?.data.map((person) => (
                    <ExpertItem
                        key={person.id}
                        person={person}
                        className={styles.item}
                    />
                ))} */}
            </div>
        </div>
    )
}

export default ExpertsList
