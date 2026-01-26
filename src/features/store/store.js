import {configureStore} from '@reduxjs/toolkit'
import tasksSlice from './tasks/tasksSlice'
import usersSlice from './users/usersSlice'

export const store=configureStore({
    reducer:{
        tasks: tasksSlice,
        users: usersSlice
    }
})