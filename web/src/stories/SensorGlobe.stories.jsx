import SensorGlobe from '../components/SensorGlobe';

export default {
    title: 'Components/SensorGlobe',
    component: SensorGlobe,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        activeCountries: { control: 'object' },
    },
};

export const Default = {
    args: {
        activeCountries: [],
    },
};

export const WithActiveCountries = {
    args: {
        activeCountries: ['France', 'Japan', 'USA'],
    },
};

export const WithMappedCountries = {
    args: {
        activeCountries: ['italy', 'japan', 'china'],
    },
};
