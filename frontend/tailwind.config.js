// tailwind.config.js
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                beige: {
                    100: '#F8F4F0',
                    500: '#98908B',
                },
                grey: {
                    100: '#F2F2F2',
                    300: '#B3B3B3',
                    900: '#201F24',
                },
                green: '#277C78',
                cyan: '#82C9D7',
                navy: '#626070',
                red: '#C94736',
                orange: '#F2CDAC',
            },
            fontFamily: {
                sans: ['Public Sans', 'sans-serif'],
            },
            keyframes: {
                modalEnter: {
                    '0%': { opacity: '0', transform: 'scale(0.9) translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                modalEnter: 'modalEnter 0.3s ease-out forwards',
                fadeIn: 'fadeIn 0.2s ease-out forwards',
            },
        },
    },
    plugins: [],
}