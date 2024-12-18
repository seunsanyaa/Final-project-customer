import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }, keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },animation: {
        fadeInUp: 'fadeInUp 1s ease-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
      colors: {
            "border": "hsl(var(--border))",
            "input": "hsl(var(--input))",
            "ring": "hsl(var(--ring))",
            "background": "hsl(var(--background))",
            "foreground": "hsl(var(--foreground))",
            "customyello": 'hsl(var(--customcola))', 
            'customgrey': 'hsl(var(--greyna))', 
            "primary": {
              "DEFAULT": "hsl(var(--primary))",
              "foreground": "hsl(var(--primary-foreground))"
            },
            "secondary": {
              "DEFAULT": "hsl(var(--secondary))",
              "foreground": "hsl(var(--secondary-foreground))"
            },
            "destructive": {
              "DEFAULT": "hsl(var(--destructive))",
              "foreground": "hsl(var(--destructive-foreground))"
            },
            "muted": {
              "DEFAULT": "hsl(var(--muted))",
              "foreground": "hsl(var(--muted-foreground))"
            },
            "accent": {
              "DEFAULT": "hsl(var(--accent))",
              "foreground": "hsl(var(--accent-foreground))"
            },
            "popover": {
              "DEFAULT": "hsl(var(--popover))",
              "foreground": "hsl(var(--popover-foreground))"
            },
            "card": {
              "DEFAULT": "hsl(var(--card))",
              "foreground": "hsl(var(--card-foreground))"
            },
            "promotion": {
              "DEFAULT": "hsl(0 84% 60%)",
              "hover": "hsl(0 84% 50%)"
            }
           
          },
      borderRadius: {
            "lg": "var(--radius)",
            "md": "calc(var(--radius) - 2px)",
            "sm": "calc(var(--radius) - 4px)"
          },
      keyframes: {
            "accordion-down": {
              "from": {
                "height": "0"
              },
              "to": {
                "height": "var(--radix-accordion-content-height)"
              }
            },
            "accordion-up": {
              "from": {
                "height": "var(--radix-accordion-content-height)"
              },
              "to": {
                "height": "0"
              }
            }
          },
          dropShadow: {
            glow: [
              "0 0px 20px rgba(255, 215, 0, 0.99)",
              "0 0px 65px rgba(255, 215, 0, 0.5)"
            ],
}},
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config