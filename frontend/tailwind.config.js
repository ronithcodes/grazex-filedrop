export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070A12",
        panel: "rgba(16, 22, 38, 0.72)",
        line: "rgba(255, 255, 255, 0.12)",
        cyan: "#29D3FF",
        mint: "#6EF3BF",
        rose: "#FF6B9D"
      },
      boxShadow: {
        glow: "0 0 80px rgba(41, 211, 255, 0.16)"
      }
    }
  },
  plugins: []
};
