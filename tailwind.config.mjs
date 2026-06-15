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
        // Bright-red palette for the BESPOKE Massage Lounger page (additive)
        red: {
          brand: '#b5162b',
          dark: '#780d1b',
          deep: '#4d0711',
          hover: '#cf243d'
        },
        rose: {
          soft: '#fff4f6',
          mid: '#f8e8eb'
        },
        gold: {
          DEFAULT: '#D7A84F',
          light: '#fff7de',
          mid: '#ffe7a8',
          dark: '#b88746'
        },
        // Luxe black/gold palette for the BESPOKE 2 Massage Chair page (additive)
        luxe: {
          black: '#09090B',
          charcoal: '#111216',
          graphite: '#1A1B20',
          soft: '#F8F3EA',
          cream: '#EFE3D0',
          muted: '#B8AEA0',
          gold: '#D6B679',
          goldDeep: '#B88746',
          champagne: '#F3D99B',
          copper: '#A86C3A',
          espresso: '#221815',
          maroon: '#7A1F2B',
          ink: '#111827'
        },
        cream: '#FFF8F3',
        ink: '#21181A',
        muted: '#6F5B61'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(33,24,26,.08)',
        glow: '0 20px 50px rgba(122,14,35,.22)',
        premium: '0 28px 90px rgba(15, 23, 42, 0.15)',
        cta: '0 18px 40px rgba(22, 163, 74, 0.25)',
        card: '0 8px 32px rgba(181,22,43,0.10)',
        red: '0 18px 50px rgba(181,22,43,0.18)',
        gold: '0 18px 60px rgba(214, 182, 121, 0.26)'
      },
      borderRadius: { soft: '1.5rem' }
    }
  },
  plugins: []
};
