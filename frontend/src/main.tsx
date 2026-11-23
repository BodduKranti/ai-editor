import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { PageRoutes } from './pageRoutes/index.tsx'
import { AuthProvider } from './utils/ContextApi.tsx'
import { ToastContainer } from 'react-toastify';
import TrackQueryProvider from './Providers/TrackQueryProvider.tsx'
import StoreProvider from './Providers/StoreProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <TrackQueryProvider>

        <StoreProvider>
            <AuthProvider>
                <ToastContainer />
                <RouterProvider router={PageRoutes} />
            </AuthProvider>
        </StoreProvider>

    </TrackQueryProvider>
)
