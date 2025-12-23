import MeasuresWidget from '../components/MeasuresWidget';

export default {
    title: 'Components/MesuresWidget',
    component: MeasuresWidget,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export const Default = {
    render: () => (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <MeasuresWidget />
        </div>
    ),
};
