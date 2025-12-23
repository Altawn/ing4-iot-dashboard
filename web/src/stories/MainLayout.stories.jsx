import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export default {
    title: 'Layouts/MainLayout',
    component: MainLayout,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']}>
                <Story />
            </MemoryRouter>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
};

export const Default = {};
