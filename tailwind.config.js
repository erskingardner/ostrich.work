/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'Inter var, sans-serif',
                    {
                        fontFeatureSettings: '"cv11", "ss01"',
                        fontVariationSettings: '"opsz" 32'
                    }
                ],
                montagu: ['Montagu Slab, serif']
            },
            boxShadow: {
                'square-br': '4px 4px 0px 0px',
                'square-tl': '-4px -4px 0px 0px'
            }
        }
    },
    plugins: [require('@tailwindcss/typography')]
};
