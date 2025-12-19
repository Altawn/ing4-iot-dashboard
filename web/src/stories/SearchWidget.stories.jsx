import SearchWidget from '../components/SearchWidget';

// Mock fetch for Storybook context (since actual API call needs running backend)
const mockSerpResponse = {
    answer_box: {
        snippet: "To pair a Philips Hue bulb: 1. Screw in the bulb and turn on the wall switch. 2. Open the Hue app and go to Settings > Light setup > Add light > Search. 3. If not found, use the serial number printed on the bulb.",
        title: "How to pair Philips Hue?"
    }
};

export default {
    title: 'Components/SearchWidget',
    component: SearchWidget,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    render: () => <div style={{ width: '350px', height: '300px' }}><SearchWidget /></div>
};
