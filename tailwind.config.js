/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clean, CARROT-Inspired Color System
        primary: {
          DEFAULT: '#FF6B6B',
          hover: '#FF5252',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          hover: '#3EBDB4',
        },
        accent: {
          DEFAULT: '#FFE66D',
          hover: '#FFD93D',
        },
        success: {
          DEFAULT: '#51CF66',
          hover: '#40C057',
        },
        danger: {
          DEFAULT: '#FF6B6B',
          hover: '#FF5252',
        },
        background: {
          DEFAULT: '#F5F5F5',
          card: '#FFFFFF',
          dark: '#1A1A2E'
        },
        text: {
          DEFAULT: '#2D3436',
          muted: '#868E96',
          light: '#FFFFFF'
        },
        border: {
          DEFAULT: '#DEE2E6',
          dark: '#CED4DA'
        }
      },
      fontSize: {
        'bank': ['clamp(40px, 12vw, 56px)', { lineHeight: '1' }],  // Reduced from 48-72px
        'score': ['clamp(20px, 5vw, 28px)', { lineHeight: '1.1' }], // Reduced from 24-32px
        'h1': ['clamp(24px, 6vw, 30px)', { lineHeight: '1.2' }],   // Reduced from 28-36px
        'h2': ['clamp(18px, 4.5vw, 22px)', { lineHeight: '1.3' }], // Reduced from 20-24px
        'body': ['clamp(16px, 4vw, 18px)', { lineHeight: '1.5' }],  // Same
        'small': ['clamp(14px, 3.5vw, 16px)', { lineHeight: '1.4' }] // Same
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'none': 'none',
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
