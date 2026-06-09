export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './assets/js/**/*.js',
    './public/assets/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7A0E23',
          dark: '#071B33',
          deep: '#061525',
          soft: '#FBECEF',
          maroon: '#7A1F2B',
          blush: '#EFF6FF',
          cream: '#F8FAFC',
          ink: '#111827',
          muted: '#6B7280'
        },
        cool: {
          navy: '#061525',
          deep: '#071B33',
          blue: '#0B73B7',
          sky: '#0EA5E9',
          soft: '#EFF6FF'
        },
        cta: {
          green: '#16A34A',
          dark: '#15803D'
        },
        promo: {
          gold: '#F59E0B',
          soft: '#FEF3C7'
        },
        gold: '#D7A84F',
        cream: '#FFF8F3',
        ink: '#21181A',
        muted: '#6F5B61'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(33,24,26,.08)',
        glow: '0 20px 50px rgba(122,14,35,.22)',
        premium: '0 28px 90px rgba(15, 23, 42, 0.15)',
        cta: '0 18px 40px rgba(22, 163, 74, 0.25)'
      },
      borderRadius: { soft: '1.5rem' }
    }
  },
  plugins: []
};
