import React from 'react'
import { useParams } from 'react-router-dom'

const ExpertDetails = () => {
    const { id } = useParams()

    return (
        <div>
            <h1>ID специалиста: {id}</h1>
            <p>тест</p>
        </div>
    )
}

export default ExpertDetails
