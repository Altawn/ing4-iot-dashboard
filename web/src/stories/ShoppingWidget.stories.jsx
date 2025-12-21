import ShoppingWidget from '../components/ShoppingWidget';

// Mock fetch to simulate API response with realistic data
const mockShoppingResponse = {
    shopping_results: [
        {
            title: "Arduino Uno R3 Original",
            link: "https://store.arduino.cc/products/arduino-uno-rev3",
            source: "Arduino Store",
            price: "24.00€",
            thumbnail: "https://store.arduino.cc/cdn/shop/products/A000066_03.front_443x.jpg?v=1629815860"
        },
        {
            title: "Raspberry Pi 4 Model B (4GB RAM)",
            link: "https://www.kubii.com/fr/cartes-raspberry-pi-4/2772-raspberry-pi-4-modele-b-4gb-3272496303259.html",
            source: "Kubii",
            price: "64.95€",
            thumbnail: "https://www.kubii.com/4236-home_default/raspberry-pi-4-modele-b-4gb.jpg"
        },
        {
            title: "ESP32-WROOM-32 Development Board",
            link: "https://www.amazon.fr/AZDelivery-ESP32-NodeMCU-Module-Development/dp/B07Z83MF5W",
            source: "Amazon",
            price: "8.99€",
            thumbnail: "https://m.media-amazon.com/images/I/61X-4rN+JXL._AC_SL1500_.jpg"
        },
        {
            title: "DHT22 Capteur Température et Humidité",
            link: "https://www.gotronic.fr/art-module-capteur-t-et-humidite-dht22-19377.htm",
            source: "GoTronic",
            price: "5.40€",
            thumbnail: "https://www.gotronic.fr/ori-module-capteur-t-et-humidite-dht22-19377.jpg"
        },
        {
            title: "Breadboard 830 Points",
            link: "https://www.amazon.fr/ELEGOO-Breadboard-Plastique-Experimentale-Arduino/dp/B01EV6LJ7G",
            source: "Amazon",
            price: "6.99€",
            thumbnail: "https://m.media-amazon.com/images/I/61+oA-+MppL._AC_SL1500_.jpg"
        },
        {
            title: "Kit de Jumper Wires M/M M/F F/F",
            link: "https://www.amazon.fr/AZDelivery-Jumper-Wire-C%C3%A2bles-Arduino/dp/B07KYHBVR7",
            source: "AZ-Delivery",
            price: "5.99€",
            thumbnail: "https://m.media-amazon.com/images/I/71wY1+s+2ZL._AC_SL1500_.jpg"
        }
    ]
};

// Intercept fetch for Storybook
const originalFetch = global.fetch;
global.fetch = async (url) => {
    if (url.includes('type=shopping')) {
        // Wait 800ms to simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            json: async () => mockShoppingResponse
        };
    }
    return originalFetch(url);
};

export default {
    title: 'Components/ShoppingWidget',
    component: ShoppingWidget,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    render: () => <div style={{ width: '400px', height: '500px' }}><ShoppingWidget /></div>
};
