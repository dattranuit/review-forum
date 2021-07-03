import { React, useEffect, useState, useReducer, useRef, useCallback } from 'react'
import { Search, Grid } from 'semantic-ui-react'
import axios from 'axios';
import { host } from "../constant";
import _ from 'lodash'

const initialState = {
    loading: false,
    results: [],
    value: '',
}

function exampleReducer(state, action) {
    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialState
        case 'START_SEARCH':
            return { ...state, loading: true, value: action.query }
        case 'FINISH_SEARCH':
            return { ...state, loading: false, results: action.results }
        case 'UPDATE_SELECTION':
            return { ...state, value: action.selection }

        default:
            throw new Error()
    }
}

function SearchExampleStandard({data}) {
    const [state, dispatch] = useReducer(exampleReducer, initialState)
    const [source, setSource] = useState(data);
    const { loading, results, value } = state

    const timeoutRef = useRef()

    // const fetchData = async () => {
    //     const res = await axios.get(`${host}/api/threads`);
    //     setSource(res.data.threads)
    // }
    // useEffect(() => {
    //     fetchData();
    // }, [])

    const handleSearchChange = useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        dispatch({ type: 'START_SEARCH', query: data.value })

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' })
                return
            }

            const re = new RegExp(_.escapeRegExp(data.value), 'i')
            const isMatch = (result) => re.test(result.title)

            dispatch({
                type: 'FINISH_SEARCH',
                results: _.filter(source, isMatch),
            })
        }, 300)
    }, [])

    const handleGoToThread = (e, d)=>{
        const win = window.open(`/forum/thread/${d.result._id}`, "_blank");
        win.focus();
    }
    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
        <Grid>
            <Grid.Column width={6}>
                <Search
                    loading={loading}
                    onResultSelect={(e, data) =>{
                            handleGoToThread(e, data)
                            dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
                        }
                    }
                    results={results}
                    onSearchChange={handleSearchChange}
                    value={value}
                />
            </Grid.Column>
        </Grid>
    )
}

export default SearchExampleStandard
