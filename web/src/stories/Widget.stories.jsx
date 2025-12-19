import Widget from '../components/Widget';

export default {
    title: 'Components/Widget',
    component: Widget,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
};

export const Default = {
    args: {
        title: 'Widget Title',
        children: 'This is the content of the widget.',
    },
};

export const FullWidth = {
    args: {
        title: 'Full Width Widget',
        children: 'This widget takes up the full width available.',
        fullWidth: true,
    },
};

export const WithoutTitle = {
    args: {
        children: 'This widget provides content without a header title.',
    },
};

export const WithComplexContent = {
    args: {
        title: 'Complex Content',
        children: (
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <p>You can put any React nodes here.</p>
                <button style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Click Me
                </button>
            </div>
        ),
    },
};
