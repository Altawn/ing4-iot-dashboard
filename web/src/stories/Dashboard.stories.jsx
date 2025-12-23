import React from 'react';
import Dashboard from '../pages/Dashboard';

export default {
    title: 'Pages/Dashboard',
    component: Dashboard,
    parameters: {
        layout: 'fullscreen',
    },
};

export const Default = {
    render: () => (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
            <Dashboard />
        </div>
    )
};
