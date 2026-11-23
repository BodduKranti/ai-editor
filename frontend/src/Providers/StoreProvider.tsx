import { type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { Store } from '../Redux/Store'

const StoreProvider = ({ children }: { children: ReactNode }) => {
    return (
        <Provider store={Store}>{children}</Provider>
    )
}

export default StoreProvider