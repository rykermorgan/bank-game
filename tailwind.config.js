/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color Palette Option A: Bold & Energetic
        primary: '#FF6B6B',     // Vibrant Red/Coral
        secondary: '#4ECDC4',   // Teal/Turquoise
        accent: '#FFE66D',      // Bright Yellow
        success: '#95E1D3',     // Mint Green
        warning: '#F38181',     // Soft Red
        danger: '#FF6B6B',      // Same as primary (for 7 rolled)
        background: {
          light: '#F7F7F7',
          dark: '#1A1A2E'
        },
        text: {
          light: '#2D3436',
          dark: '#FFFFFF'
        }
      },
      fontSize: {
        'bank': ['clamp(48px, 15vw, 72px)', { lineHeight: '1' }],
        'score': ['clamp(24px, 6vw, 32px)', { lineHeight: '1.2' }],
        'h1': ['clamp(28px, 7vw, 36px)', { lineHeight: '1.2' }],
        'h2': ['clamp(20px, 5vw, 24px)', { lineHeight: '1.3' }],
        'body': ['clamp(16px, 4vw, 18px)', { lineHeight: '1.5' }],
        'small': ['clamp(14px, 3.5vw, 16px)', { lineHeight: '1.4' }]
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'button': '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
      minHeight: {
        'touch': '44px', // iOS/Android minimum tap target
      },
      minWidth: {
        'touch': '44px',
      }
    },
  },
  plugins: [],
}
