import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.tsx'
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/index.ts'
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import AppInitializer from './components/Common/AppInitializer.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StyledEngineProvider enableCssLayer>
            <ReduxProvider store={store}>
                <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
                <AppInitializer />
                <RouterProvider router={router} />
            </ReduxProvider>
        </StyledEngineProvider>
    </StrictMode>,
);