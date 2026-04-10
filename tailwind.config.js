/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cyber: ['"Orbitron"', 'sans-serif'],
        data: ['"Space Mono"', 'monospace'],
        ui: ['"Rajdhani"', 'sans-serif'],
      },
      colors: {
        dssp: {
          bg: "#020205",         // Deep void
          primary: "#00f0ff",    // Neon Cyan
          accent: "#ff00e5",     // Cyber Magenta
          danger: "#ff00e5",     // Redundant but distinct semantic usage
          success: "#39ff14",    // Acid Green
          warning: "#ff8c00",    // Hyper Orange
          panel: "rgba(10, 10, 15, 0.4)", // Deeper glass baseline
          border: "rgba(0, 240, 255, 0.2)",
        }
      },
      backgroundImage: {
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')",
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 4s linear infinite',
        'flicker': 'flicker 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 5px #00f0ff)' },
          '50%': { opacity: 0.5, filter: 'drop-shadow(0 0 25px #00f0ff)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: 1 },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: 0.4 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
