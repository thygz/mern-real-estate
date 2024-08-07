/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                car: 'url(./assets/car4.jpg)',
                carPark: 'url(./assets/carpark.jpg)',
            },
        },
    },
    plugins: [],
};
