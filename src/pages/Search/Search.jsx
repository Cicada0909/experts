import React, { useRef } from 'react'
import styles from './Search.module.css'

const Search = () => {
    return (
        <input
            style={{
                width: '70%',
                height: '3%',
                border: '1px solid black',
                borderRadius: '5px',
            }}
            placeholder=" Поиск..."
        ></input>
    )
}

export default Search
