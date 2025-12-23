import Admin from '../pages/Admin';

export default {
    title: 'Pages/Admin',
    component: Admin,
    parameters: {
        layout: 'fullscreen',
    },
};

export const Default = {
    render: () => (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
            <Admin />
        </div>
    )
};
