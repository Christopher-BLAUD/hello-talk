import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home/Home';
import App from './pages/App/App';
import { SpeechProvider } from './utils/Context/SpeechContext';
import './global.css';

const router = createHashRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/app',
        element: <App />
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <SpeechProvider>
            <RouterProvider router={router} />
        </SpeechProvider>
    </React.StrictMode>
);
