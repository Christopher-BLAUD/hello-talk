import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './utils/Context/AppContext';
import Home from './pages/Home/Home';
import App from './pages/App/App';
import Dashboard from './pages/Dashboard/Dashboard';
import Words from './components/Words/Words';
import Sentences from './components/Sentences/Sentences';
import Categories from './components/Categories/Categories';
import './global.css';

const router = createHashRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/app',
        element: <App />
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
            {
                path: '',
                element: <Words />
            },
            {
                path: 'sentences',
                element: <Sentences />
            },
            {
                path: 'categories',
                element: <Categories/>
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AppProvider>
            <RouterProvider router={router} />
        </AppProvider>
    </React.StrictMode>
);
