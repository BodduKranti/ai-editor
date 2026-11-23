
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserAuthReducer from './slice/UserAuth.slice'
import projectReducer from './slice/Project.Slice'

const reducer = combineReducers({
    auth: UserAuthReducer,
    project: projectReducer
})

export const Store = configureStore({
    reducer: reducer
})


export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch