/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation:{
        marquee: "marque 22s linear infinite",
        "push": "push 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes:{
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        push: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-15px) rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
}