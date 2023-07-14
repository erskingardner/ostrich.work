/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
    ],
    theme: {
        extend: {
            animation: {
                waiting: 'stretchdelay 1.2s infinite ease-in-out'
            },
            keyframes: {
                stretchdelay: {
                    '0%, 40%, 100%': { transform: 'scaleY(0.4)' },
                    '20%': { transform: 'scaleY(1.0)' }
                }
            },
            colors: {
                // flowbite-svelte
                primary: {
                    50: '#FFF5F2',
                    100: '#FFF1EE',
                    200: '#FFE4DE',
                    300: '#FFD5CC',
                    400: '#FFBCAD',
                    500: '#FE795D',
                    600: '#EF562F',
                    700: '#EB4F27',
                    800: '#CC4522',
                    900: '#A5371B'
                }
            },
            backgroundImage: {
                noise10: "url('/noise-402x402x10.png')",
                noise21: "url('/noise-402x402x21.png')",
                noise30: "url('/noise-402x402x30.png')"
            },
            fontFamily: {
                sans: [
                    'Inter var, sans-serif',
                    {
                        fontFeatureSettings: '"cv11", "ss01"',
                        fontVariationSettings: '"opsz" 32'
                    }
                ],
                montagu: ['Montagu Slab, serif'],
                poppins: ['Poppins, Inter var, sans-serif']
            },
            boxShadow: {
                'square-purple-sm': '4px 4px 0 #6d28d9',
                'square-purple': '6px 6px 0 #6d28d9',
                'square-purple-lg': '10px 10px 0 #6d28d9',
                'square-grey-sm': '4px 4px 0 #444',
                'square-grey': '6px 6px 0 #444',
                'square-orange-sm': '4px 4px 0 #ea580c',
                'square-orange': '6px 6px 0 #ea580c',
                'square-orange-lg': '10px 10px 0 #ea580c'
            }
        }
    },
    plugins: [require('@tailwindcss/typography'), require('flowbite/plugin')]
};
